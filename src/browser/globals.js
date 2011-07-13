var NODES = require('ui/dom/NODES')
NODES.exposeGlobals()

NODES.attributeHandlers.data = function(dataProperty) {
  dataProperty.observe(bind(this, function(dataValue) {
    this._el.innerHTML = dataValue
  }))
}

Class = require('std/Class')
bind = require('std/bind')