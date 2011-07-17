var Publiser = require('std/Publisher'),
  io = require('socket.io')

module.exports = Class(Publisher, function(supr) {
  
  this.connect = function() {
    io
      .on('message', bind(this, '_onMessage'))
      .connect('localhost', 8080)
  }
  
  this._onMessage = function(message) {
    if (message.command)
    this.publish('Message')
  }
  
})