FORCE:

test: FORCE
	npm run tslint
	npm run jest

compile: FORCE
	npm run tslint
	npm run tsc

up: FORCE
	docker-compose up