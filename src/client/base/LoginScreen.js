var UIComponent = require('ui/dom/Component')

module.exports = new Class(UIComponent, function(supr) {
	
	this.renderContent = function() {
		DIV('LoginScreen',
			DIV('centered',
				BUTTON('button', 'login', { click:bind(gClient, gClient.login) })
			)
		).appendTo(this)
		
		setTimeout(bind(gClient, gClient.login), 150)
	}
})