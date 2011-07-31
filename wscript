import time
import waflib

CLIENTS = { 'iphone':'ios', 'browser':'browser' }

def configure(self):
	self.env.VERSION = str(time.time())
	self.env.COMPILE_SCRIPT = '../scripts/compileClient'
	self.env.INSTALL_DIR = 'static/'+self.env.VERSION+'/'
	pass

def build(bld):
	for client, clientDirName in CLIENTS.items():
		clientSource = 'src/client/'+clientDirName+'/'+client
		bld(target=client+'.js', source=clientSource+'.js', rule='${COMPILE_SCRIPT} ${SRC} > ${TGT}')
		bld(target=client+'.html', source=[clientSource+'.html', client+'.js'], rule=embedJS, client=client)
		bld(target=client+'.html.gz', source=client+'.html', rule=gzip)
		bld(source=[client+'.html', client+'.html.gz'], rule=installFiles)

# Build rules
#############
def embedJS(self):
	htmlContent = open(self.inputs[0].abspath(), 'r').read()
	compiledJS = open(self.inputs[1].abspath(), 'r').read()

	includeString = '<script src="/require/'+self.generator.client+'"></script>'
	htmlContent = htmlContent.replace(includeString, '<script>'+compiledJS+'</script>')

	open(self.outputs[0].abspath(), 'w').write(htmlContent)

def gzip(self):
	sourceFile = self.inputs[0].abspath()
	targetFile = self.outputs[0].abspath()
	self.exec_command('gzip -nc --best '+sourceFile+' > '+targetFile)

def installFiles(self):
	self.exec_command(subst('mkdir -p ${INSTALL_DIR}', self.env))
	for input in self.inputs:
		self.exec_command(subst('cp '+input.abspath()+' ${INSTALL_DIR}', self.env))

# Util
######	
def subst(str, env):
	return waflib.Utils.subst_vars(str, env)
