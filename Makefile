all: install build serve

install:
	cd functions
	npm i
	cd src
	npm i
	cd functions && firebase use --add

build:
	cd functions && ./node_modules/.bin/tsc
	cd src && npm run build

serve:
	firebase serve --only functions,hosting

