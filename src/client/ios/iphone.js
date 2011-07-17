require('globals')

var Client = require('base/Client'),
  LoginScreen = require('base/LoginScreen'),
  WorkScreen = require('base/WorkScreen')

gClient = new Client(window, new LoginScreen, new WorkScreen)
gClient.start()
