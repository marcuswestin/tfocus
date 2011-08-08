var fin = require('fin/lib/orm-api')

fin.orm.process({
	"Global": {
		"allTasks": { id:1, type:"List", of:"Task" }
	},
	"User": {
		"name": { id:1, type:"Text" },
		"tasks": { id:2, type:"List", of:"Task" }
	},
	"Task": {
		"title": { id:1, type:"Text" },
		"owner": { id:2, type:"User" },
		"done":  { id:3, type:"Boolean" }
	}
})

module.exports = {
	setUser: setUser,
	taskList: fin.orm.global.allTasks,
	createTask: createTask
}

var user
function setUser(userID) {
	user = new fin.orm.User(userID)
}

function createTask(callback) {
	var task = new fin.orm.Task({ title:"A task!", owner:user })
	gData.taskList.push(task)
	task.waitForGUID(function(id) {
		callback(task)
	})
}