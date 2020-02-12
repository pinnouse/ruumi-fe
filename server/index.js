require('dotenv').config()
const express = require('express')
const ws = require('ws')
const url = require('url')
const http = require('http')
const consola = require('consola')
const { Nuxt, Builder } = require('nuxt')
const app = express()

const bodyParser = require('body-parser')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)

const CronJob = require('cron').CronJob

const Rooms = require('./rooms')
const wsMap = new Map()

// Import and Set Nuxt.js options
const config = require('../nuxt.config.js')
config.dev = process.env.NODE_ENV !== 'production'

const { login, refresh, getUser } = require('./user_auth')

const api = require('./api')

const PATHS = ['user']

async function start () {
  // Init Nuxt.js
  const nuxt = new Nuxt(config)

  const { host, port } = nuxt.options.server

  // Build only in dev mode
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  } else {
    await nuxt.ready()
  }

  const COOKIE_AGE = 1000 * 60 * 60 * 24
  let sess = {
    cookie: { maxAge: COOKIE_AGE },
    store: new MongoStore({
      url: 'mongodb://' +
        (process.env.MONGO_USER && process.env.MONGO_PASS ? `${process.env.MONGO_USER}:${process.env.MONGO_PASS}@` : "") +
        (process.env.MONGO_URL || 'localhost') + ':' + (process.env.MONGO_PORT || 27017),
      touchAfter: COOKIE_AGE
    }),
    secret: process.env.SESSION_SECRET || 'random_secret_ruumi_should_change',
    resave: false,
    saveUninitialized: false
  }
  if (!config.dev) {
    app.set('trust proxy', 1)
    //sess.cookie.secure = true
  }

  const sessionParser = session(sess)

  app.use(sessionParser)
  app.use(bodyParser.json())

  app.disable('x-powered-by')

  app.use(async (req, res, next) => {
    if (/\w\/$/.test(req.path)) {
      res.redirect(301, req.path.substring(0, req.path.length-1))
      return
    }

    if (req.session.access && !req.session.user) {
      let user = await getUser(req.session.access.access)
      if (user.verified) {
        req.session.user = user
      } else {
        res.status(403).send('<!DOCTYPE html><html><body>You must have a verified Discord account to use this service. <a href="/login">Try logging in again</a>.</body></html>')
        return
      }
    }

    next()
  })

  app.get('/api/:item', api)

  app.get('/localApi/:item', (req, res) => {
    if (PATHS.includes(req.params.item)) {
      res.send(req.session[req.params.item])
      return
    }
    res.status(403).send("Not authorized to access this resource")
  })

  var rooms = new Rooms();
  app.post('/createRoom', (req, res) => {
    let data = req.body.data;
    let id = rooms.createRoom(data.user, data.anime, data.episode)
    res.send({roomId: id})
  })

  app.get('/getRoom', (req, res) => {
    if (req.query && req.query.room) {
      let r = rooms.getRoom(req.query.room)
      if (r) {
        res.send(r)
        return
      } else {
        res.status(404).send("Room not found")
        return
      }
    }
    res.status(400).send("Error, no room specified")
  })

  app.post('/delRoom', (req, res) => {
    let data = req.body.data;
    if (rooms.getRoom(data.roomId) && rooms.getRoom(data.roomId).owner.id === data.userId) {
      rooms.deleteRoom(data.roomId)
      res.status(200).send("Deleted room.")
      return
    }
    res.status(403).send("You cannot delete this room bruv.")
  })

  app.get('/auth', async (req, res) => {
    if (!req.query.code) {
      if (req.session.access && req.session.access.expires <= Date.now()) {
        let response = await refresh(req.session.access.refresh)
        if (response) {
          req.session.access = {
            access:  response.access_token,
            refresh: response.refresh_token,
            expires: response.expires_in + Date.now()
          }
          res.redirect('.')
          return
        }
      }
      res.status(403).send("No sir.")
      return
    } else {
      let response = await login(req.query.code)
      if (response) {
        req.session.access = {
          access:  response.access_token,
          refresh: response.refresh_token,
          expires: response.expires_in + Date.now()
        }
        res.redirect('.')
      }
    }
  })

  app.get('/login', async (req, res) => {
    if (!req.session.access) {
      let redir = process.env.NODE_ENV !== 'production' ? 'http%3A%2F%2Flocalhost%3A3000%2Fauth' : process.env.REDIRECT_URI
      res.redirect(
        `https://discordapp.com/api/oauth2/authorize?client_id=669322924657737748&redirect_uri=${
          redir
        }&response_type=code&scope=identify%20email`)
    } else if (req.session.access.expires <= Date.now()) {
      let response = await refresh(req.session.access.refresh)
      if (response) {
        req.session.access = {
          access:  response.access_token,
          refresh: response.refresh_token,
          expires: response.expires_in + Date.now()
        }
        res.redirect('.')
      }
    }
  })

  app.get('/logout', (req, res) => {
    req.session.destroy()
    res.redirect('.')
  })

  // Give nuxt middleware to express
  app.use(nuxt.render)

  // Listen the server
  //app.listen(port, host)
  let server = http.createServer(app)
  let wss = new ws.Server({ clientTracking: false, noServer: true })

  server.on('upgrade', (req, socket, head) => {
    console.log('Parsing session from request...')
    sessionParser(req, {}, () => {
      if (!req.session.user) {
        socket.destroy()
        return
      }
      console.log('Session is parsed')
      wss.handleUpgrade(req, socket, head, ws => {
        wss.emit('connection', ws, req)
      })
    })
  })

  wss.on('connection', (ws, req) => {
    let q = url.parse(req.url, true)
    if (!q.query || !q.query.r) return;
    wsMap.set(req.session.user.id, {room: rooms.getRoom(q.query.r), ws: ws })

    ws.on('message', msg => {
      console.log(`got message ${msg} from ${req.session.user.username}`)
      let room = wsMap.get(req.session.user.id).room
      console.log(room)
      if (!room) return;
      room.users.forEach(u => {
        wsMap.get(u.id).ws.send(msg)
      })
    })

    ws.on('close', () => {
      wsMap.delete(req.session.user.id)
    })
  })

  let job = new CronJob("0 */20 * * * *", () => {
    let del = rooms.checkRooms()
    console.log(`Checked ${rooms.size()} and removed ${del}`)
  })
  job.start()

  server.listen(port, host)
  
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  })
}
start()
