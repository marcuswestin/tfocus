var Publisher = require('std/Publisher')

module.exports = Class(Publisher, function() {
  
  this.login = function() {
    setTimeout(bind(this, this._publish, 'Session', { id:'TEST_ID_123' }), 50)
  }
  
})