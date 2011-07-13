var UIComponent = require('ui/dom/Component')

module.exports = new Class(UIComponent, function(supr) {
	
	this.init = function(fb) {
		supr(this, 'init')
		this._fb = fb
	}
	
	this.renderContent = function() {
		DIV('LoginScreen',
			DIV('centered',
				BUTTON('button', 'login', { click:bind(this._fb, this._fb.login) })
			)
		).appendTo(this)
		
		setTimeout(bind(this._fb, this._fb.login), 150)
	}
})