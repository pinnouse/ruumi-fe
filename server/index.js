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
    next()
  })

  var rooms = new Rooms();
  app.post('/createRoom', (req, res) => {
    let data = req.body.data;
    let id = rooms.createRoom(data.user, data.episode.srcURL, data.anime.name)
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
      }
    }
    res.status(400).send("Error, no room specified")
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
