var http = require('http'),
	fin = require('fin'),
	engine = require('fin/engines/development'),
	requireServer = require('require/server')

var server = http.createServer(function(req, res) {
	if (requireServer.isRequireRequest(req)) { return }
	res.writeHeader(200, { 'Content-Type':'text/html' })
	res.end([
		'<!doctype html>',
		'<html>',
		'<body>',
		'<script src="/require/browser-app"></script>',
		'</body>',
		'</html>'
	].join('\n'))
})

fin.mount(server, engine)
requireServer.mount(server, { port:8080 })
server.listen(8080)
console.log('listening on :8080')

requireServer
	.addPath('std', __dirname + '/../node_modules/std.js')
	.addPath('fin', __dirname + '/../node_modules/fin')
	.addPath('ui', __dirname + '/../node_modules/ui.js')
	.addPath('browser', __dirname + '/browser')
	.addFile('browser-app', __dirname + '/browser/app.js')
	.addPath('data', __dirname + '/data')