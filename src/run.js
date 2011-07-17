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
  || sendError(res, "Unkown URL", 400)
})

fin.mount(server, engine)
requireServer.mount(server, { port:8080 })
server.listen(8080)

requireServer
	.addPath('std', __dirname + '/../node_modules/std.js')
	.addPath('fin', __dirname + '/../node_modules/fin')
	.addPath('ui', __dirname + '/../node_modules/ui.js')
	.addPath('data', __dirname + '/data')

	.addPath('base', __dirname + '/client/base')
	.addFile('globals', __dirname + '/client/base/globals.js')

	.addPath('iphone', __dirname + '/client/iphone')
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

function sendError(res, err, code) {
  res.writeHead(code || 500)
  res.end(err.toString())
}
