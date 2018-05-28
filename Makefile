FORCE:

test-run: FORCE
	npm test

build: FORCE
	docker-compose build

dispose: FORCE
	-docker rm missioncontrol_missioncontrol_1

rebuild: dispose build

up: FORCE copy-contracts test-run build
	docker-compose up

up-bg: FORCE copy-contracts test-run build
	docker-compose up -d

down: FORCE
	docker-compose down

flush: FORCE
	docker exec -it missioncontrol_redis_1 redis-cli FLUSHALL

redis: FORCE
	docker exec -it missioncontrol_redis_1 redis-cli

redis-gui: FORCE
	docker run -d --rm -p 8081:8081 --network host rediscommander/redis-commander

aql: FORCE
	@docker exec -it --env COLUMNS='200' missioncontrol_aerospike_1 aql

log: FORCE
	docker logs missioncontrol_missioncontrol_1 -f

create-aws-stg-env: FORCE
	## create aerospike instance
	aws ec2 run-instances \
		--image-id ami-a6ef04db \
		--count 1 \
		--instance-type r4.large \
		--key-name aerospike \
		--region us-east-1 \
		--security-group-ids sg-1163ff67 \
		--block-device-mappings file://aerospike-mapping.json

	## after instance created run the following (only once)

	#sudo chkconfig aerospike
	#sudo service aerospike start

	# and associate elastic IP

	## create redis instance
	@aws elasticache create-cache-cluster \
		--cache-cluster-id mcontrol-redis-stg \
		--cache-node-type cache.t2.small \
		--engine redis \
		--engine-version 3.2.4 \
		--num-cache-nodes 1 \
		--cache-parameter-group default.redis3.2

	@eb init missioncontrol

	@eb create missioncontrol-stg --cname missioncontrol-stg -k missioncontrol-key

deploy-aws-stg-env: FORCE
	@eb deploy --staged

create-aws-prod-env: FORCE
	@eb init missioncontrol-prod --cname missioncontrol-prod -k missioncontrol-prod-key
	@eb create missioncontrol-prod

deploy-aws-prod-env: FORCE
	@eb deploy --staged

copy-contracts: FORCE
	-rm -rf ./server/build
	-cp -r ../contracts/build ./server
