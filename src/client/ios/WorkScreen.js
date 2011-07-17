var WorkScreen = require('base/WorkScreen')

module.exports = Class(WorkScreen, function() {
	
	this._renderHeader = function() {
		return DIV('header',
			DIV('shadow',
				SPAN('logo', 'Work'),
				BUTTON({ click:bind(gData, gData.createTask) }, 'Create task')
			)
		)
	}
	
	this._renderBody = function() {
		return this._body = DIV('body',
			DIV('scrollable vertical',
				this._taskList = DIV('taskList')
			)
		)
	}
	
})