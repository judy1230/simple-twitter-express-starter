let routes = require('./routes');



const multer = require('multer')

module.exports = (app) => {
    app.use('/', routes)
	//app.use('/api', apis)
}
