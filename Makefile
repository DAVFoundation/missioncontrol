FORCE:

tslint: FORCE
	npm run tslint

jest: FORCE
	npm run jest

tsc: FORCE
	npm run tsc

pre-push: tslint tsc jest

up: FORCE
	docker-compose up
