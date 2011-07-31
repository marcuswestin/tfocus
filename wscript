import os
import time
import waflib
import inspect
import getpass

CLIENTS = { 'iphone':'ios', 'browser':'browser' }

def configure(self):
	self.env.COMPILE_SCRIPT = '../scripts/compileClient'
	self.env.VERSION = str(int(time.time()))+'-'+getpass.getuser()
	self.env.STATIC_DIR = 'static'
	self.env.INSTALL_DIR = self.env.STATIC_DIR+'/'+self.env.VERSION
	pass

def build(bld):
	for client, clientDirName in CLIENTS.items():
		clientBuildDir = 'client/'+clientDirName
		clientTarget = clientBuildDir+'/'+client
		clientSource = 'src/'+clientBuildDir+'/'+client
		bld(target=clientTarget+'.js', source=clientSource+'.js', rule='${COMPILE_SCRIPT} ${SRC} > ${TGT}')
		bld(target=clientTarget+'.html', source=[clientSource+'.html', clientTarget+'.js'], rule=embedJS, client=client)
		bld(target=clientTarget+'.html.gz', source=clientTarget+'.html', rule=gzip)
		bld(source=[clientTarget+'.html', clientTarget+'.html.gz'], rule=installClientFiles)
	bld(rule='mkdir -p ${INSTALL_DIR}')
	bld(rule='ln -snf ${VERSION} ${STATIC_DIR}/current')

# Build rules
#############
def embedJS(self):
	htmlContent = self.inputs[0].read()
	compiledJS = self.inputs[1].read()

	includeString = '<script src="/require/'+self.generator.client+'"></script>'
	htmlContent = htmlContent.replace(includeString, '<script>'+compiledJS+'</script>')

	self.outputs[0].write(htmlContent)

def gzip(self):
	sourceFile = self.inputs[0].abspath()
	targetFile = self.outputs[0].abspath()
	return self.exec_command('gzip -nc --best '+sourceFile+' > '+targetFile)

def installClientFiles(self):
	for input in self.inputs:
		self.exec_command(waflib.Utils.subst_vars('mkdir -p  ${INSTALL_DIR}/'+input.bld_dir(), self.env))
		self.exec_command(waflib.Utils.subst_vars('cp '+input.abspath()+' ${INSTALL_DIR}/'+input.bld_dir(), self.env))
