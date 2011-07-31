var Class = require('std/Class'),
	bind = require('std/bind'),
	Server = require('./Server')

module.exports = Class(Server, function(supr) {
	
	this.init = function() {
		this._requestHandler = bind(this, th)
		Server.prototype.init.apply(this, arguments)
	}
	
})