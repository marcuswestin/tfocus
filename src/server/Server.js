var Class = require('std/Class'),
	bind = require('std/bind'),
	each = require('std/each'),
	http = require('http'),
	fin = require('fin'),
	engine = require('fin/engines/development'),
	stylus = require('stylus'),
	fs = require('fs'),
	path = require('path')

module.exports = Class(function() {
	
	this.init = function(opts) {
		this._port = opts.port
		this._host = opts.host
		this._staticDir = path.normalize(opts.staticDir)
		this._printErrors = opts.printErrors
		this._finEngine = require('fin/engines/' + opts.engine)
		this._httpServer = http.createServer(bind(this, this._routeRequest))
	}
	
	this.run = function() {
		this._setupRoutes()
		fin.mount(this._httpServer, this._finEngine)
		this._httpServer.listen(this._port, this._host)
	}
	
	/* Request routing
	 *****************/
	this._setupRoutes = function() {
		this._routes = []
		this._handlers = []
		this
			._setupRoute(/^\/$/, this._handleRootRequest)
			._setupRoute(/^\/(\w+)\/$/, this._handleClientHTMLRequest)
			._setupRoute(/^\/static\/([\w\d-]+)\/([^\.]+)\.(\w+)/, this._handleStaticRequest)
	}
	
	this._setupRoute = function(regex, handler) {
		this._routes.push(regex)
		this._handlers.push(handler)
		return this
	}

	this._routeRequest = function(req, res) {
		for (var i=0, regex; regex=this._routes[i]; i++) {
			var match = req.url.match(regex)
			if (!match) { continue }
			this._handlers[i].call(this, match, req, res)
			return
		}
		this._sendError(res, 404, "Unknown URL")
	}
	
	/* Request handlers
	 ******************/
	this._handleRootRequest = function(match, req, res) {
		var userAgent = req.headers['user-agent']
		var location = 
			  userAgent.match('iPad') ? 'iphone'
			: userAgent.match('iPhone') ? 'iphone'
			: userAgent.match('iPod') ? 'iphone'
			: 'iphone'
		// TODO cache
		res.writeHead(302, { 'Location': '/' + location + '/' })
		res.end()
	}
	
	this._clients = { browser:'browser/browser', iphone:'ios/iphone' }
	this._currentVersionLink = 'current'
	this._handleClientHTMLRequest = function(match, req, res) {
		var clientPathBase = this._clients[match[1]]
		if (!clientPathBase) { return this._sendError(res, 404) }
		this._sendStaticFile(this._currentVersionLink, 'client/' + clientPathBase, 'html', res)
	}
	
	this._handleStaticRequest = function(match, req, res) {
		var version = match[1],
			path = match[2],
			extension = match[3]
		this._sendStaticFile(version, path, 'html', res)
	}
	
	/* Util
	 ******/
	this._contentTypes = { html:'text/html', js:'text/javascript', png:'image/png' }
	this._sendStaticFile = function(version, pathBase, extension, res) {
		// TODO read from memory cache
		fs.readFile(this._getStaticPath(version, pathBase, extension), 'utf8', bind(this, function(err, contents) {
			if (err) { return this._sendError(res, 404, err) }
			// TODO cache in memory
			// TODO cache
			res.writeHead(200, { 'Content-Type':this._contentTypes[extension] })
			res.end(contents)
		}))
	}
	
	this._getStaticPath = function(version, pathBase, extension) {
		return this._staticDir+'/'+version+'/'+pathBase+'.'+extension
	}

	this._sendError = function(res, code, err) {
		res.writeHead(code || 500)
		var message = this._printErrors && (err.stack ? err.stack : err.message || err)
		res.end(message)
	}
})

// function handleImageRequest(req, res) {
// 	var match = req.url.match(/^\/img\/(\w+)\/([\w\/]+)\.png$/)
// 	if (!match || !clients[match[1]]) { return false }
// 	var filename = srcDir + '/client/' + clients[match[1]] + '-img/' + match[2] + '.png'
// 	fs.readFile(filename, function(err, imageData) {
// 		if (err) { return sendError(res, err, 404) }
// 		res.writeHead(200, { 'Content-Type':'image/png' })
// 		res.end(imageData)
// 	})
// 	return true
// }

// function handleOfflineManifestRequest(req, res) {
// 	var match = req.url.match(/^\/offline-manifest\/(\w+)\.manifest$/)
// 	if (!match || !clients[match[1]]) { return false }
// 	var userAgent = req.headers['user-agent'],
// 		isMobile = userAgent.match('iPad') || userAgent.match('iPod') || userAgent.match('iPhone')
// 	if (isMobile) {
// 		res.writeHead(200, { 'Content-Type':'text/cache-manifest' })
// 		res.write([
// 			'CACHE MANIFEST',
// 			'# ' + new Date().getTime(),
// 			'/require/iphone',
// 			'/stylus/iphone.styl'
// 		].join('\n'))
// 	} else {
// 		res.writeHead(204) // No-Content
// 	}
// 	return true
// }
