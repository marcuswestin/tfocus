module.exports = {
  "User": {
    "name": { id:1, type:"Text" },
    "tasks": { id:2, type:"List", of:"Task" }
  },
  "Task": {
    "title": { id:1, type:"Text" },
    "owner": { id:2, type:"User" }
  }
}
