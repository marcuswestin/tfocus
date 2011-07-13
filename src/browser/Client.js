var Facebook = require('data/Facebook'),
	LoginScreen = require('ui/LoginScreen'),
	WorkScreen = require('ui/WorkScreen'),
	User = require('data/User')

var Client = Class(function() {
	
	this.init = function(win) {
		this._win = win
		this._root = win.document.body
		this._fb = new Facebook(this._win)
			.subscribe('Session', bind(this, this._onFacebookSession))
			.load()
		
		this._loginScreen = new LoginScreen(this._fb)
			.appendTo(this._root)
	}
	
	this._onFacebookSession = function(session) {
		this._loginScreen.remove()
		this._user = new User(session.id)
		fin.connect(location.hostname, location.port, bind(this, this._onConnect))
	}
	
	this._onConnect = function() {
	  this._workScreen = new WorksScreen()
			.appendTo(this._root)
	}
	
	this.getUser = function() { return this._user }
})

