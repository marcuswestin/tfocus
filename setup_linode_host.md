https://github.com/joyent/node/wiki/Installing-Node.js-via-package-manager
	sudo apt-get install python-software-properties
	sudo add-apt-repository ppa:chris-lea/node.js
	sudo apt-get update
	sudo apt-get install nodejs

https://github.com/isaacs/npm#readme
	curl http://npmjs.org/install.sh | clean=no sh

https://github.com/marcuswestin/dotfiles
	git clone git@github.com:marcuswestin/dotfiles.git
	cd dotfiles
	node install.js ~
	cd ~

https://github.com/marcuswestin/work
	git clone git@github.com:marcuswestin/work.git
	cd work
	node src/run.js 96.126.98.135
