var NODES = require('ui/dom/NODES')
NODES.exposeGlobals()

NODES.attributeHandlers.data = function(dataProperty) {
	if (dataProperty.type == 'Boolean') {
		dataProperty.observe(bind(this, function(checked) {
			this._el.checked = checked
		}))
		this.on('change', bind(this, function() {
			dataProperty.set(this._el.checked)
		}))
	} else {
		dataProperty.observe(bind(this, function(dataValue) {
			this._el.innerHTML = dataValue
		}))
	}
}

Class = require('std/Class')
bind = require('std/bind')
gData = require('data')