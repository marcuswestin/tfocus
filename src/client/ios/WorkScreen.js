var WorkScreen = require('base/WorkScreen'),
	getDocumentHeight = require('ui/dom/getDocumentHeight'),
	getViewportSize = require('ui/dom/getViewportSize')

module.exports = Class(WorkScreen, function() {
	
	this._renderHeader = function() {
		return DIV('header',
			DIV('shadow',
				SPAN('logo', 'Work'),
				BUTTON({ click:bind(gData, gData.createTask, bind(this, this._selectTask)) }, '+')
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
	
	this._selectTask = function(task) {
		var node = this._getTaskNode(task)
		if (!this._taskFocus) {
			this._taskFocus = DIV('taskFocus',
				this._taskTitleInput = TEXTAREA('editableTitle', { 
					keypress:bind(this, this._onFocusedTaskTitleKeyPress),
					blur:bind(this, this._onFocusedTaskTitleBlur)
				})
			)
		}
		this._focusedTask = task
		this._taskFocus.appendTo(this._body)
		this._taskFocus.style({ position:'absolute', top:0 })
		var viewportSize = getViewportSize(this._win)
		this._taskTitleInput.style({ width:viewportSize.width, height:viewportSize.height - this._headerHeight })
		this._taskTitleInput.getElement().value = this._focusedTask.title.getCachedValue()
		this._taskTitleInput.getElement().focus()
		
		// var offsetTop = node.getElement().offsetTop,
		// 	height = getDocumentHeight(this._doc) - this._header.getOffset().height - this._footer.getOffset().height
		// node.style({ height:height })
		// scrollability.scrollTo(this._scrollDiv.getElement(), 0, -offsetTop, 0)
	}
	
	this._onFocusedTaskTitleKeyPress = function() {
		setTimeout(bind(this, function() {
			this._focusedTask.title.set(this._taskTitleInput.getElement().value)
		}))
	}
	
	this._onFocusedTaskTitleBlur = function() {
		this._taskFocus.remove()
	}
})
