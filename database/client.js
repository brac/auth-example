// jshint asi:true

const { Client } = require('pg')

const client = new Client({
  user: process.env.USER,
  host: 'localhost',
  database: 'ss_auth',
  password: null,
  port: 5432,
})

client.connect()

module.exports = client