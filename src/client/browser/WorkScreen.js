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
			BUTTON({ click:bind(gData, gData.createTask) }, 'Create task'),
			this._tasks=DIV('tasks')).appendTo(this)
	}
	
	this._renderTask = function(task) {
		this._nodes[task.id] = DIV('task', { data:task.title }).appendTo(this._tasks)
	}
	
	this._removeTask = function(task) {
		this._nodes[task.id].remove()
	}
})
