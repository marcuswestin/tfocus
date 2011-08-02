var Class = require('std/Class'),
	Server = require('./Server'),
	requireServer = require('require/server'),
	configureRequire = require('../../scripts/configureRequire'),
	fs = require('fs'),
	stylus = require('stylus')

module.exports = Class(Server, function(supr) {

	this.run = function() {
		configureRequire(requireServer)
		requireServer.mount(this._httpServer, { port:this._port, host:this._host })
		Server.prototype.run.apply(this, arguments)
	}
	
	this._setupRoutes = function() {
		Server.prototype._setupRoutes.apply(this, arguments)
		this
			._setupRoute(/^\/stylus\/(\w+)\.styl$/, this._handleStylusRequest)
	}
	
	this._routeRequest = function(req, res) {
		if (requireServer.isRequireRequest(req)) { return }
		Server.prototype._routeRequest.apply(this, arguments)
	}
	
	this._handleStylusRequest = function(match, req, res) {
		var filename = __dirname + '/../client/' + this._clients[match[1]] + '.styl'
		fs.readFile(filename, 'utf8', function(err, stylusSource) {
			if (err) { return res.sendError(err, 404) }
			stylus.render(stylusSource, { filename:filename }, function(err, css) {
				if (err) { return res.sendError(err, 500) }
				res.send(css, 'text/css')
			})
		})
	}
	
	this._getStaticPath = function(version, pathBase, extension) {
		return this._staticDir+'/'+pathBase+'.'+extension
	}
	
})