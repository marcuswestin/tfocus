var UIComponent = require('ui/dom/Component')

module.exports = new Class(UIComponent, function(supr) {

	this.init = function() {
		supr(this, 'init')
		this._nodes = {}
	}

	this.renderContent = function() {
		gData.taskList
			.on('push', bind(this, this._renderTask))
			.on('remove', bind(this, this._removeTask))

		DIV('WorkScreen',
			this._renderHeader(),
			this._renderBody(),
			this._renderFooter()
		).appendTo(this)
	}
	
	this._renderHeader = function() {
		return this._header = DIV('header',
			BUTTON({ click:bind(gData, gData.createTask) }, 'Create task')
		)
	}
	
	this._renderBody = function() {
		return this._body = DIV('body',
			this._taskList = DIV('taskList')
		)
	}
	
	this._renderFooter = function() {
		return this._footer = DIV('footer')
	}

	this._renderTask = function(task) {
		this._nodes[task.id] = DIV('task', { data:task.title }).appendTo(this._taskList)
	}

	this._removeTask = function(task) {
		this._nodes[task.id].remove()
	}
})
