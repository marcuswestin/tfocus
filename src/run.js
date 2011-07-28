var http = require('http'),
	fin = require('fin'),
	engine = require('fin/engines/development'),
	requireServer = require('require/server'),
	stylus = require('stylus'),
	fs = require('fs')

var server = http.createServer(function(req, res) {
	requireServer.isRequireRequest(req)
	|| handleStylusRequest(req, res)
	|| handleHTMLRequest(req, res)
	|| handleImageRequest(req, res)
	|| handleBaseRequest(req, res)
	|| handleOfflineManifestRequest(req, res)
	|| sendError(res, "Unkown URL", 400)
})

var port = 80,
	host = process.argv[2] || 'localhost'
fin.mount(server, engine)
requireServer.mount(server, { port:port, host:host })
server.listen(port, host)

requireServer
	.addPath('std', __dirname + '/../node_modules/std.js')
	.addPath('fin', __dirname + '/../node_modules/fin')
	.addPath('ui', __dirname + '/../node_modules/ui.js')
	.addFile('scrollability', __dirname + '/../node_modules/scrollability/scrollability.js')

	.addPath('data', __dirname + '/data')
	.addPath('base', __dirname + '/client/base')
	.addFile('globals', __dirname + '/client/base/globals.js')

	.addPath('ios', __dirname + '/client/ios')
	.addFile('iphone', __dirname + '/client/ios/iphone.js')

	.addPath('browser', __dirname + '/client/browser')
	.addFile('browser', __dirname + '/client/browser/browser.js')

var clients = {
	'browser': 'browser/browser',
	'iphone': 'ios/iphone'
}

function handleHTMLRequest(req, res) {
	var match = req.url.match(/^\/(\w+)$/)
	if (!match || !clients[match[1]]) { return false }
	var filename = __dirname + '/client/' + clients[match[1]] + '.html'
	fs.readFile(filename, 'utf8', function(err, html) {
		if (err) { return sendError(res, err, 404) }
		res.writeHead(200, { 'Content-Type':'text/html' })
		res.end(html)
	})
	return true
}

function handleImageRequest(req, res) {
	var match = req.url.match(/^\/img\/(\w+)\/([\w\/]+)\.png$/)
	if (!match || !clients[match[1]]) { return false }
	var filename = __dirname + '/client/' + clients[match[1]] + '-img/' + match[2] + '.png'
	fs.readFile(filename, function(err, imageData) {
		if (err) { return sendError(res, err, 404) }
		res.writeHead(200, { 'Content-Type':'image/png' })
		res.end(imageData)
	})
	return true
}

function handleStylusRequest(req, res) {
	var match = req.url.match(/^\/stylus\/(\w+)\.styl$/)
	if (!match || !clients[match[1]]) { return false }
	var filename = __dirname + '/client/' + clients[match[1]] + '.styl'
	fs.readFile(filename, 'utf8', function(err, stylusSource) {
		if (err) { return sendError(res, err, 404) }
		stylus.render(stylusSource, { filename:filename }, function(err, css) {
			if (err) { return sendError(res, err, 500) }
			res.writeHead(200, { 'Content-Type':'text/css' })
			res.end(css)
		})
	})
	return true
}

function handleBaseRequest(req, res) {
	if (req.url != '/') { return false }
	var userAgent = req.headers['user-agent']
	var location = 
		  userAgent.match('iPad') ? 'iphone'
		: userAgent.match('iPhone') ? 'iphone'
		: userAgent.match('iPod') ? 'iphone'
		: 'iphone'
	res.writeHead(302, { 'Location': '/' + location })
	res.end()
}

function handleOfflineManifestRequest(req, res) {
	var match = req.url.match(/^\/offline-manifest\/(\w+)\.manifest$/)
	if (!match || !clients[match[1]]) { return false }
	var userAgent = req.headers['user-agent'],
		isMobile = userAgent.match('iPad') || userAgent.match('iPod') || userAgent.match('iPhone')
	if (isMobile) {
		res.writeHead(200, { 'Content-Type':'text/cache-manifest' })
		res.write([
			'CACHE MANIFEST',
			'# ' + new Date().getTime(),
			'/require/iphone',
			'/stylus/iphone.styl'
		].join('\n'))
	} else {
		res.writeHead(204) // No-Content
	}
	return true
}

function sendError(res, err, code) {
	res.writeHead(code || 500)
	res.end(err.toString())
}
