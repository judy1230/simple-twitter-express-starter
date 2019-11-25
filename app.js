const express = require('express')
const bodyParser = require('body-parser')
const helpers = require('./_helpers');

const app = express()
const port = 3000

app.use(bodyParser.urlencoded({ extended: true }), bodyParser.json());

// use helpers.getUser(req) to replace req.user
// use helpers.ensureAuthenticated(req) to replace req.isAuthenticated()

app.get('/', (req, res) => res.send('Hello World!'))
app.listen(port, () => console.log(`Example app listening on port ${port}!`))

module.exports = app
