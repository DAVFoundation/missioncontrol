test-run:
	npm test

build:
	docker-compose build

dispose:
	-docker rm missioncontrol_missioncontrol_1

rebuild: dispose build

up: copy-contracts test-run build 
	docker-compose up

down:
	docker-compose down

flush:
	docker exec -it missioncontrol_redis_1 redis-cli FLUSHALL

log:
	docker logs missioncontrol_missioncontrol_1 -f

create-aws-prod-env:
	@eb init missioncontrol-prod --profile eb-cli-dav --cname missioncontrol-prod -k missioncontrol-prod-key
	@eb create missioncontrol-prod --profile eb-cli-dav

deploy-aws-prod-env:
	@eb deploy --profile eb-cli-dav --staged

copy-contracts:
	-rm -rf ./server/build
	-cp -r ../contracts/build ./server
