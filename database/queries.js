// jshint asi:true

const client     = require('./client')

const findUser = (search) => {
  console.log(search)


  // client.query(
    // `
      // SELECT
        // *
      // FROM
        // users
      // WHERE
        // email = $1
    // `, [req.body.email]
  // )
}

const createUser = (user) => {

}

module.exports = {
  findUser,
  createUser
}