var finOrmAPI = require('fin/lib/orm-api')

finOrmAPI.process({
	"Global": {
		"allTasks": { id:1, type:"List", of:"Task" }
	},
	"User": {
		"name": { id:1, type:"Text" },
		"tasks": { id:2, type:"List", of:"Task" }
	},
	"Task": {
		"title": { id:1, type:"Text" },
		"owner": { id:2, type:"User" }
	}
})

module.exports = {
	setUser: setUser,
	taskList: finOrmAPI.global.allTasks,
	createTask: createTask
}

var user
function setUser(userID) {
	user = new fin.orm.User(userID)
}

function createTask() {
	gData.taskList.push(new fin.orm.Task({ title:"A task!", owner:user }))
}