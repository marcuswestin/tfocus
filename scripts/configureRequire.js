var modulesDir = __dirname + '/../node_modules',
	srcDir = __dirname + '/../src'


module.exports = function(requireCompilerOrServer) {
	return requireCompilerOrServer
		.addPath('std', modulesDir + '/std.js')
		.addPath('fin', modulesDir + '/fin')
		.addPath('ui', modulesDir + '/ui.js')
		.addFile('scrollability', modulesDir + '/scrollability/scrollability.js')

		.addPath('data', srcDir + '/data')
		.addPath('base', srcDir + '/client/base')
		.addFile('globals', srcDir + '/client/base/globals.js')

		.addPath('ios', srcDir + '/client/ios')
		.addFile('iphone', srcDir + '/client/ios/iphone.js')

		.addPath('browser', srcDir + '/client/browser')
		.addFile('browser', srcDir + '/client/browser/browser.js')
}