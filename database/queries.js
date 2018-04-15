// jshint asi:true

const client     = require('./client')

const findUser = (search) => {
  return new Promise((resolve, reject) => {
    client.query(
    `
      SELECT
        *
      FROM
        users
      WHERE
        ${search.type} = $1
    `, [search.value]
    ).then(
      results => resolve(results),
      error => reject(error)
    )
  })
}

const createUser = (user) => {
  return new Promise((resolve, reject) => {
    client.query(
      `
      INSERT INTO
        users (firstName, lastName, email, password)
      VALUES
        ($1, $2, $3, $4)
      `,
      [user.firstName, user.lastName, user.email, user.password]
    ).then(
      results => resolve(results),
      error => reject(error)
    )
  })
}

module.exports = {
  findUser,
  createUser
}