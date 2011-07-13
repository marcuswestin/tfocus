var UIComponent = require('ui/Component')

module.exports = new Class(UIComponent, function(supr) {
	
	this.init = function(fb) {
		supr(this, 'init')
		this._fb = fb
	}
	
	this.renderContent = function() {
		return FRAGMENT(
			DIV('LoginScreen',
				DIV('centered',
					BUTTON('button', { click:bind(this._fb, this._fb.login) })
				)
			)
		)
	}
})