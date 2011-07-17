require('globals')

var Client = require('base/Client'),
  LoginScreen = require('base/LoginScreen'),
  WorkScreen = require('base/WorkScreen'),
  data = require('data')

gClient = new Client(window, new LoginScreen, new WorkScreen)
gClient.start()
