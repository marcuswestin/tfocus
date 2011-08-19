var Class = require('std/Class'),
	bind = require('std/bind'),
	each = require('std/each'),
	http = require('http'),
	fin = require('fin'),
	engine = require('fin/engines/development'),
	fs = require('fs'),
	path = require('path'),
	time = require('std/time'),
	Response = require('./Response'),
	client = require('std/client')

module.exports = Class(function() {
	
	this.init = function(opts) {
		this._port = opts.port
		this._host = opts.host
		this._staticDir = path.normalize(opts.staticDir)
		this._printErrors = opts.printErrors
		this._finEngine = require('fin/engines/' + opts.engine)
		this._httpServer = http.createServer(bind(this, this._routeRequest))
		this._favicon = fs.readFileSync(__dirname + '/img/favicon.ico')
	}
	
	this.run = function() {
		this._setupRoutes()
		fin.mount(this._httpServer, this._finEngine, { 'transports':['xhr-polling', 'jsonp-polling'], 'log level': 1 })
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
			._setupRoute(/^\/favicon\.ico$/, this._serveFavicon)
			._setupRoute(/^\/static\/([\w\d-]+)\/([^\.]+)\.(\w+)/, this._handleStaticRequest)
			._setupRoute(/^\/apple-touch-icon.*\.png$/, this._notFound)
	}
	
	this._setupRoute = function(regex, handler) {
		this._routes.push(regex)
		this._handlers.push(handler)
		return this
	}

	this._routeRequest = function(req, res) {
		var response = new Response(res, this._printErrors)
		for (var i=0, regex; regex=this._routes[i]; i++) {
			var match = req.url.match(regex)
			if (!match) { continue }
			this._handlers[i].call(this, match, req, response)
			return
		}
		response.sendError('Unknown URL ' + req.url, 404)
	}
	
	/* Request handlers
	 ******************/
	this._serveFavicon = function(match, req, res) {
		res
			.cache(30 * time.days)
			.send(this._favicon, 'image/ico')
	}
	
	this._handleRootRequest = function(match, req, res) {
		var reqClient = client.parse(req.headers['user-agent'])
		var location = 
			  reqClient.isIPad ? 'iphone'
			: reqClient.isIPhone ? 'iphone'
			: reqClient.isIPod ? 'iphone'
			: 'iphone'
		
		res
			.redirect('/'+location+'/')
			.cache(3 * time.days)
			.send()
	}
	
	this._clients = { browser:'browser/browser', iphone:'ios/iphone' }
	this._currentVersionLink = 'current'
	this._handleClientHTMLRequest = function(match, req, res) {
		var clientPathBase = this._clients[match[1]]
		if (!clientPathBase) { return res.sendError('No such client "'+match[1]+'"', 404) }
		var reqClient = client.parse(req.headers['user-agent'])
		if (reqClient.isIOS && reqClient.osVersion < 5.0) {
			this._sendJSError(res, 'Aw shucks. You need iOS 5.0')
			return
		}
		this._sendStaticFile(this._currentVersionLink, 'client/' + clientPathBase, 'html', res)
	}
	
	this._handleStaticRequest = function(match, req, res) {
		var version = match[1],
			path = match[2],
			extension = match[3]
		this._sendStaticFile(version, path, extension, res)
	}
	
	this._notFound = function(match, req, res) {
		res
			.noContent()
			.cache(3 * time.days)
			.send()
	}
	
	/* Util
	 ******/
	this._contentTypes = { html:'text/html', js:'text/javascript', png:'image/png' }
	this._sendStaticFile = function(version, pathBase, extension, res) {
		// TODO read from memory cache
		fs.readFile(this._getStaticPath(version, pathBase+'.'+extension), 'utf8', bind(this, function(err, contents) {
			// TODO cache in memory
			if (err) { return res.sendError(err, 404) }
			res
				.cache(3 * time.hours)
				.send(contents, this._contentTypes[extension])
		}))
	}
	
	this._getStaticPath = function(version, path) {
		return this._staticDir+'/'+version+'/'+path
	}
	
	this._sendJSError = function(res, message) {
		res
			.cache(3 * time.hours)
			.send('<script>alert("'+message+'")</script>', 'text/html')
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
