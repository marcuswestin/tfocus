tfocus
======

set up
------

	git submodule init
	git submodule update
	cd node_modules/fin/
	sudo npm install .
	cd ../..

apt-get install haproxy
sudo haproxy -f scripts/conf/haproxy.conf

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
	./scripts/runServer 96.126.98.135

mkdir -p tfocus/build/static
mkdir -p tfocus/scripts
mkdir -p tfocus/src/server
mkdir -p tfocus/node_modules

96.126.98.135
bot pass wud6sj&dke73d
in .ssh/config
	host tfocus
	HostName 96.126.98.135
	IdentityFile ~/.ssh/id_rsa.tfocus
	User bot
