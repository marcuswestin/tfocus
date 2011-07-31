import os
import time
import inspect
import getpass

CLIENTS = { 'iphone':'ios', 'browser':'browser' }

def configure(self):
	self.env.COMPILE_JS_SCRIPT = '../scripts/compileClientJS'
	self.env.COMPILE_STYLUS_SCRIPT = '../scripts/compileClientStylus'
	self.env.VERSION = str(int(time.time()))+'-'+getpass.getuser()
	self.env.STATIC_DIR = 'static'
	self.env.PREFIX = self.env.STATIC_DIR+'/'+self.env.VERSION
	pass

def build(bld):
	for client, clientDirName in CLIENTS.items():
		clientBuildDir = 'client/'+clientDirName
		clientTarget = clientBuildDir+'/'+client
		clientSource = 'src/'+clientBuildDir+'/'+client
		bld(target=clientTarget+'.js', source=clientSource+'.js', rule='${COMPILE_JS_SCRIPT} ${SRC} > ${TGT}')
		bld(target=clientTarget+'.css', source=clientSource+'.styl', rule='${COMPILE_STYLUS_SCRIPT} ${SRC} > ${TGT}')
		bld(target=clientTarget+'.html', source=[clientSource+'.html', clientTarget+'.js', clientTarget+'.css'], rule=embedJS, client=client)
		bld(target=clientTarget+'.html.gz', source=clientTarget+'.html', rule=gzip)
		bld(source=[clientTarget+'.html', clientTarget+'.html.gz'], rule=installClientFiles)
		bld(rule=copyClientImages, imageSourceDir=clientSource+'-img', imageTargetDir=clientTarget+'-img')
	bld(rule='mkdir -p ${PREFIX}')
	bld(rule='ln -snf ${VERSION} ${STATIC_DIR}/current')

# Build rules
#############
def embedJS(self):
	htmlContent = self.inputs[0].read()
	compiledJS = self.inputs[1].read()
	compiledCSS = self.inputs[2].read()
	client = self.generator.client

	scriptInclude = '<script src="/require/'+client+'"></script>'
	htmlContent = htmlContent.replace(scriptInclude, '<script>'+compiledJS+'</script>')

	stylusInclude = '<link href="/stylus/'+client+'.styl" rel="stylesheet" type="text/css">'
	htmlContent = htmlContent.replace(stylusInclude, '<style type="text/css">'+compiledCSS+'</style>')

	htmlContent = htmlContent.replace('/VERSION/', '/'+self.env.VERSION+'/')

	self.outputs[0].write(htmlContent)

def gzip(self):
	sourceFile = self.inputs[0].abspath()
	targetFile = self.outputs[0].abspath()
	return self.exec_command('gzip -nc --best '+sourceFile+' > '+targetFile)

def installClientFiles(self):
	for input in self.inputs:
		self.exec_command('mkdir -p '+self.env.PREFIX+'/'+input.bld_dir())
		self.exec_command('cp '+input.abspath()+' '+self.env.PREFIX+'/'+input.bld_dir())

def copyClientImages(self):
	imageSourceDir = self.generator.imageSourceDir
	imageTargetDir = self.env.PREFIX+'/'+self.generator.imageTargetDir
	self.exec_command('mkdir -p '+imageTargetDir+'; cp ../'+imageSourceDir+'/* '+imageTargetDir)
