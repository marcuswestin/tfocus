var fin = require('fin/server'),
	engine = require('fin/engines/development'),
	connect = require('connect')

var Server = Class(function() {
	
	this.init = function(port) {
		var server = connect
			.get('/', bind(this, '_sendFile', '../../browser/index.html'))
			.listen(port)

		fin
			.authenticate(bind(this, '_authenticate'))
			.mount(server, engine)
	}
	
	this.authenticate = function(connection, request) {
		if (connection.authenticated) { return true }
		connection.authenticated = (request.username == 'marcus' && request.password == 123)
		return connection.authenticated
	}
	
})

new Server(8080)
