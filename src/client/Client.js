var Facebook = require('data/Facebook'),
	LoginScreen = require('client/browser/LoginScreen'),
	WorkScreen = require('client/browser/WorkScreen'),
	User = require('data/User')

module.exports = Class(function() {
	
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
		gData.setUser(session.id)
		fin.connect(location.hostname, location.port, bind(this, this._onConnect))
	}
	
	this._onConnect = function() {
		this._workScreen = new WorkScreen()
			.appendTo(this._root)
	}
	
	this.getUser = function() { return this._user }
})

