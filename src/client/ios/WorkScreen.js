var WorkScreen = require('base/WorkScreen'),
	getDocumentHeight = require('ui/dom/getDocumentHeight')

module.exports = Class(WorkScreen, function() {
	
	this._taskHeight = 21

	this._renderHeader = function() {
		return DIV('header',
			DIV('shadow',
				SPAN('logo', 'Work'),
				BUTTON({ click:bind(gData, gData.createTask) }, 'Create task')
			)
		)
	}
	
	this._renderBody = function() {
		return DIV('body',
			this._scrollDiv = DIV('scrollable vertical',
				this._taskList = DIV('taskList')
			)
		)
	}
	
	this._deselectTask = function(task, node) {
		node.style({ height:this._taskHeight })
	}
	
	this._selectTask = function(task, node) {
		var offsetTop = node.getElement().offsetTop,
			height = getDocumentHeight(this._doc) - this._header.getOffset().height - this._footer.getOffset().height
		node.style({ height:height })
		scrollability.scrollTo(this._scrollDiv.getElement(), 0, -offsetTop, 200)
	}
})