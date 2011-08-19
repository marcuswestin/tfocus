var UIComponent = require('ui/dom/Component')

module.exports = new Class(UIComponent, function(supr) {

	this._headerHeight = 30
	
	this.init = function() {
		supr(this, 'init')
		this._nodes = {}
	}

	this.renderContent = function() {
		DIV('WorkScreen',
			this._header = this._renderHeader().render(this).style({ height:this._headerHeight }),
			this._body = this._renderBody().render(this).style({ top:this._headerHeight + 4 })
		).appendTo(this)

		gData.taskList
			.on('clear', bind(this, this._clearTasks))
			.on('push', bind(this, this._renderTask))
			.on('remove', bind(this, this._removeTask))
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
	
	this._clearTasks = function() {
		this._taskList.getElement().innerHTML = ''
		this._nodes = {}
	}
	
	this._renderTask = function(task) {
		var node = this._nodes[task._oid] = DIV('task',
			INPUT('done', { type:'checkbox', data:task.done }),
			DIV('title', { data:task.title, mouseup:bind(this, this._handleTaskClick, task) })
		).appendTo(this._taskList)
		var checkHideTask = function() {
			var doHide = gData.local.hideCompletedTasks.getCachedValue(),
				isDone = task.done.getCachedValue(),
				display = (doHide && isDone == true) ? 'none' : 'block'
			node.style({ display:display })
		}
		gData.local.hideCompletedTasks.observe(checkHideTask)
		task.done.observe(checkHideTask)
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
