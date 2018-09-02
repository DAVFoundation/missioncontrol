FORCE:

tslint: FORCE
	npm run tslint

jest: FORCE
	npm run jest

tsc: FORCE
	npm run tsc

spellcheck: FORCE
	npm run spellcheck

pre-push: tslint tsc jest

cassandra-gui:
	docker run --rm --name "cassandra-gui" -d --network host -e CASSANDRA_HOST=127.0.0.1 -e CASSANDRA_USER=cassandra -e CASSANDRA_PASSWORD=cassandra metavige/cassandra-web

down: FORCE
	docker-compose down

up: FORCE
	docker-compose up
