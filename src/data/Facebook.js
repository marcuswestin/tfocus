var Publisher = require('std/Publisher')

module.exports = Class(Publisher, function() {

	this.login = function() {
		setTimeout(bind(this, this._publish, 'Session', { id:123 }), 50)
	}
	
	this.load = function() {
		return this
	}

})