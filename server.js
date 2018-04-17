// jshint asi:true

const express        = require('express')
const bodyParser     = require('body-parser')
const pg             = require('pg')
const app            = express()
const sessions       = require('client-sessions')
const bcrypt         = require('bcryptjs')
const { findUser,
        createUser } = require('./database/queries')

app.set('view engine', 'pug')

app.use(bodyParser.urlencoded({extended: false}))
app.use(sessions({
  cookieName: 'session',
  secret: 'duffman54',
  duration: 30 * 60 * 1000 // 30 mins
}))

app.use((req, res, next) => {
  if (!(req.session && req.session.userId)) {return next()}

  findUser({
    type: 'id',
    value: req.session.userId
  }).then(
    results => {
      req.user          = results.rows[0]
      req.user.password = undefined
      res.locals.user   = req.user

      next()
    },
    error => next(error)
  )
})

const loginRequired = (req, res, next) => {
  if (!req.user) {
    return res.redirect('/login')
  }
  next()
}

app.get('/', (req, res) => {
  res.render('index')
})

app.get('/register', (req, res) => {
  res.render('register')
})

app.post('/register', (req, res) => {
  createUser(req.body).then(
    results => res.redirect('/dashboard'),
    error => {
      if (error.code == "23505") {
        res.render('register', { error: "Email is already taken"})
      } else {
        res.render('register', {error: error})
      }
    }
  )
})

app.get('/login', (req, res) => {
  res.render('login')
})

app.post('/login', (req, res) => {
  findUser({
    type: 'email',
    value: req.body.email
  }).then(
    results => {
      if (results.rows.length==0) { return res.render('login', {error: 'Incorrect Email / Password'}) }

      bcrypt.compare(req.body.password, results.rows[0].password).then(
        compared => {
          if (!compared) {return res.render('login', {error: 'Incorrect Password'})}

          req.session.userId = results.rows[0].id
          return res.redirect('/dashboard')
        },
        error => res.render('login', { error: error })
      )
    },
    error => res.render('login', {error: error})
  )
})

app.get('/dashboard', loginRequired, (req, res, next) => {
  console.log(`${req.user.firstname} has logged in`)
  return res.render('dashboard')
})

app.listen(3000, () => {
  console.log('Auth App example running on port 3000')
})