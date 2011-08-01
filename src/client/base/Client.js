var Facebook = require('data/Facebook')

module.exports = Class(function() {
	
	this.init = function(win, loginScreen, worksScreen) {
		this._win = win
		this._loginScreen = loginScreen
		this._workScreen = worksScreen
		
		this._root = win.document.body
		this._fb = new Facebook(this._win)
			.subscribe('Session', bind(this, this._onFacebookSession))
			.load()
	}
	
	this.start = function() { this._loginScreen.appendTo(this._root) }
	
	this.login = function() {
	  this._fb.login()
	}
	
	this._onFacebookSession = function(session) {
		this._loginScreen.remove()
		gData.setUser(session.id)
		fin.connect(bind(this, this._onConnect))
	}
	
	this._onConnect = function() {
		this._workScreen.appendTo(this._root)
	}
	
	this.getUser = function() { return this._user }
})

