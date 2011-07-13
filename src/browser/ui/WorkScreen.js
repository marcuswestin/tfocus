var UIComponent = require('ui/Component')

module.exports = new Class(UIComponent, function(supr) {
	
	this.init = function() {
		supr(this, 'init')
		this._nodes = {}
	}
	
	this.renderContent = function() {
    gData
      .
    
    gTaskList
      .observe('add', bind(this, '_renderTask'))
			.observe('remove', bind(this, '_removeTask'))
		
		return DIV('WorkScreen', this._tasks=DIV('tasks'))
	}
	
	this._renderTask = function(task) {
		this._nodes[task.id] = DIV('task', { click:bind(gState, 'setTask', task), bind:task.observe('title') }).appendTo(this._tasks)
	}
	
	this._removeTask = function(task) {
		this._nodes[task.id].remove()
	}
})

<script src="/fin/orm.js"></script>
<script>
var user = null,
	$ = function(id) { return document.getElementById(id) }

fin.orm.process({
	"Global": {
		"messages": { id:1, type:"List", of:"Message" }
	},
	"Message": {
		"text": { id:1, type:"Text" },
		"from": { id:2, type:"User" }
	},
	"User": {
		"name": { id:1, type:"Text" },
		"age": { id:2, type:"Number" }
	}
})

fin.connect(location.hostname, location.port, function() {
	hide($('connecting'))
	show($('user'))
})

$('login').onclick = function() {
	user = new fin.orm.User({ name: $('username').value, age: 25 })
	hide($('login'))
	show($('online'))
	reflectProperty($('username'), user.name)
	user.name.observe(function(name) { $('status').innerHTML = 'Online as "'+name+'"' })
}

$('send').onclick = function() {
	var message = new fin.orm.Message({ from:user, text:$('message').value })
	fin.orm.global.messages.push(message)
	$('message').value = ''
}

fin.orm.global.messages.on('push', function(message) {
	var div = $('messages').appendChild(document.createElement('div')),
		sender = div.appendChild(document.createElement('div')),
		messageInput = div.appendChild(document.createElement('input'))
	
	message.from.name.observe(function(value) { sender.innerHTML = value + ':' })
	
	reflectProperty(messageInput, message.text)
})

function reflectProperty(input, property) {
	property.observe(function(value) { input.value = value })
	var lastValue = input.value
	input.onkeypress = function() { setTimeout(function() {
		if (input.value == lastValue) { return }
		lastValue = input.value
		property.set(input.value)
	}, 0)}
}

function show(el) { el.style.display = 'block' }
function hide(el) { el.style.display = 'none' }
</script>