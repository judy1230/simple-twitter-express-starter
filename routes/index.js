let routes = require('./routes');
//let apis = require('./apis')
const express = require('express');
const app = express.Router();


const multer = require('multer')

module.exports = (app) => {
    app.use('/', routes)
	//app.use('/api', apis)
}
