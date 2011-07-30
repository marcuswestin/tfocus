def configure(self):
	pass

def build(bld):
	clients = { 'iphone':'ios', 'browser':'browser' }
	
	for clientName, clientDirName in clients.items():
		clientDir = 'src/client/'+clientDirName+'/'
		clientBuildName = 'client_'+clientName
		bld(name=clientBuildName, clientDir=clientDir, clientName=clientName, target=clientName+'.js', rule=compileClientJS)
		bld(after=clientBuildName, clientDir=clientDir, clientName=clientName, target=clientName+'.html', rule=embedClientJS)

def compileClientJS(self):
	clientName = self.generator.clientName
	clientDir = self.generator.clientDir
	targetFile = self.outputs[0].abspath()

	return self.exec_command('../scripts/compileClient ../'+clientDir+'/'+clientName+'.js > ' + targetFile)

def embedClientJS(self):
	clientName = self.generator.clientName
	clientDir = self.generator.clientDir
	targetFile = self.outputs[0].abspath()

	htmlContent = open(clientDir+clientName+'.html', 'r').read()
	compiledJS = open('build/'+clientName+'.js', 'r').read()

	includeString = '<script src="/require/'+clientName+'"></script>'
	htmlContent = htmlContent.replace(includeString, '<script>'+compiledJS+'</script>')

	open(targetFile, 'w').write(htmlContent)
