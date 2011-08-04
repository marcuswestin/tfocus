var UIComponent = require('ui/dom/Component')

module.exports = new Class(UIComponent, function(supr) {

	this._headerHeight = 30
	this._footerHeight = 0
	
	this.init = function() {
		supr(this, 'init')
		this._nodes = {}
	}

	this.renderContent = function() {
		gData.taskList
			.on('push', bind(this, this._renderTask))
			.on('remove', bind(this, this._removeTask))

		DIV('WorkScreen',
			this._header = this._renderHeader().render(this).style({ height:this._headerHeight }),
			this._body = this._renderBody().render(this).style({ top:this._headerHeight + 4, bottom:this._footerHeight }),
			this._footer = this._renderFooter().render(this).style({ height:this._footerHeight })
		).appendTo(this)
	}
	
	this._renderHeader = function() {
		return DIV('header',
			BUTTON({ click:bind(gData, gData.createTask) }, '+')
		)
	}
	
	this._renderBody = function() {
		return DIV('body',
			this._taskList = DIV('taskList')
		)
	}
	
	this._renderFooter = function() {
		return DIV('footer')
	}

	this._renderTask = function(task) {
		this._nodes[task._oid] = DIV('task', { data:task.title, mouseup:bind(this, this._handleTaskClick, task) }).appendTo(this._taskList)
	}
	
	this._handleTaskClick = function(task) {
		if (this._currentTask) {
			this._deselectTask(this._currentTask, this._getTaskNode(this._currentTask))
		}
		if (task == this._currentTask) {
			delete this._currentTask
			return
		}
		this._currentTask = task
		this._selectTask(task)
	}

	this._removeTask = function(task) {
		this._getTaskNode(task).remove()
	}
	
	this._getTaskNode = function(task) {
		return this._nodes[task._oid]
	}
})
