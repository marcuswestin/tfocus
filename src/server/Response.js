var Class = require('std/Class')

module.exports = Class(function() {
	
	this.init = function(res, printErrors) {
		this._res = res
		this._printErrors = printErrors
		this._code = 200
		this._headers = {}
	}
	
	this.cache = function(milliseconds) {
		// TODO what about the 'Cache-Control':'no-cache' header? and Pragma?
		this._headers['Expires'] = new Date(new Date().getTime() + milliseconds).toUTCString()
		return this
	}
	
	this.redirect = function(location) {
		this._code = 302
		this._headers['Location'] = location
		return this
	}
	
	this.send = function(data, contentType) {
		// TODO No-Content if content length == 0
		if (data) { this._headers['Content-Length'] = data.length }
		if (contentType) { this._headers['Content-Type'] = contentType }
		this._res.writeHead(this._code, this._headers)
		this._res.end(data)
		return this
	}
	
	this.sendError = function(err, code) {
		this._res.writeHead(code || 500)
		var message = this._printErrors && (err.stack ? err.stack : err.message || err)
		this._res.end(message)
		process.stderr.write("RESPONSE ERROR code:" + code + " error:" + (err.stack ? err.stack : (err + ": " + new Error().stack)) + "\n")
		return this
	}
})