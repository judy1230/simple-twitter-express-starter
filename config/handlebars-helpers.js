const moment = require('moment')
const helpersreq = require('../_helpers')

module.exports = {
	ifCond: function (a, b, options) {
		if (a === b) {
			return options.fn(this)
		}
		return options.inverse(this)
	},
	moment: function (a) {
		return moment(a).fromNow()
	},
	ifNotEquals: function (arg1, arg2, options) {
		console.log('arg1', arg1)
		console.log('arg2', arg2)

		return (arg1 === arg2) ? options.inverse(this): options.fn(this)
	},
}

