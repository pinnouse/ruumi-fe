const express = require('express')
const consola = require('consola')
const { Nuxt, Builder } = require('nuxt')
const app = express()

const bodyParser = require('body-parser')
const session = require('express-session')
const MemoryStore = require('memorystore')(session)

const Rooms = require('./rooms')

// Import and Set Nuxt.js options
const config = require('../nuxt.config.js')
config.dev = process.env.NODE_ENV !== 'production'

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
    store: new MemoryStore({
      checkPeriod: COOKIE_AGE
    }),
    secret: 'random_secret_ruumi_should_change',
    resave: false,
    saveUninitialized: true
  }
  if (!config.dev) {
    app.set('trust proxy', 1)
    sess.cookie.secure = true
  }

  app.use(session(sess))
  app.use(bodyParser.json())

  app.disable('x-powered-by')

  app.use((req, res, next) => {
    if (/\w\/$/.test(req.path)) {
      res.redirect(301, req.path.substring(0, req.path.length-1))
      return
    }
    if (!req.session.user) {
      var S4 = function() {
        return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
      };
      req.session.user = {
        id: S4()+S4()+'-'+S4()+'-'+S4()+'-'+S4()+S4(),
        name: 'a random name'
      }
    }
    next()
  })

  app.post('/changeName', (req, res) => {
    if (req.params.name) {
      req.session.user.name = req.params.name
      res.send('success')
      return
    }
    res.status(405).send('Bad request')
  })

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
    let id = rooms.createRoom(data.user, data.episode.srcURL, data.anime.name, data.episode.epNum)
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

  // Give nuxt middleware to express
  app.use(nuxt.render)

  // Listen the server
  app.listen(port, host)
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  })
}
start()
