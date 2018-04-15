// jshint asi:true

const express        = require('express')
const bodyParser     = require('body-parser')
const pg             = require('pg')
const app            = express()
const client         = require('./database/client')
const sessions       = require('client-sessions')
const { findUser,
        createUser } = require('./database/queries')


app.set('view engine', 'pug')

app.use(bodyParser.urlencoded({extended: false}))
app.use(sessions({
  cookieName: 'session',
  secret: 'duffman54',
  duration: 30 * 60 * 1000 // 30 mins
}))


app.get('/', (req, res) => {
  res.render('index')
})

app.get('/register', (req, res) => {
  res.render('register')
})

app.post('/register', (req, res) => {
  let user = req.body

  client.query(
    `
    INSERT INTO
      users (firstName, lastName, email, password)
    VALUES
      ($1, $2, $3, $4)
    `,
    [req.body.firstName, req.body.lastName, req.body.email, req.body.password])
  .then(
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
  findUser(req.body)
  client.query(
    `
      SELECT
        *
      FROM
        users
      WHERE
        email = $1
    `, [req.body.email]
  ).then(
    results => {
      if (results.rows.length == 0 || results.rows[0].password !== req.body.password) {
        return res.render('login', {error: 'Incorrect Email / Password'})
      }
      req.session.userId = results.rows[0].id
      return res.redirect('/dashboard')
    },
    error => {
      return res.render('login', {error: error})
    }
  )
})

app.get('/dashboard', (req, res, next) => {
  if (!(req.session && req.session.userId)) {
    return res.redirect('/login')
  }
  findUser(req.session)
  client.query(
    `
      SELECT
        *
      FROM
        users
      WHERE
        id = $1
    `, [req.session.userId]
  ).then(
    results => res.render('dashboard'),
    error => {
      return next(error)
    }
  )
})

app.listen(3000, () => {
  console.log('Auth App example running on port 3000')
})