FORCE:

build: TIMESTAMP=$(shell date +%y%m%d-%H%M -u)
build: FORCE
	@echo Building with timestamp $(TIMESTAMP)
	docker build ../. -f ../dockers/Dockerfile.api -t davnetwork/dav-api:$(TIMESTAMP)
	docker build ../. -f ../dockers/Dockerfile.cassandra -t davnetwork/dav-cassandra:$(TIMESTAMP)
	docker build ../. -f ../dockers/Dockerfile.kafka -t davnetwork/dav-kafka:$(TIMESTAMP)
	docker build ../. -f ../dockers/Dockerfile.kafka-init -t davnetwork/dav-kafka-init:$(TIMESTAMP)
	docker build ../. -f ../dockers/Dockerfile.nginx -t davnetwork/dav-nginx:$(TIMESTAMP)
	docker build ../. -f ../dockers/Dockerfile.zookeeper -t davnetwork/dav-zookeeper:$(TIMESTAMP)
	docker build ../. -f ../dockers/Dockerfile.zookeeper-init -t davnetwork/dav-zookeeper-init:$(TIMESTAMP)

	docker push davnetwork/dav-api:$(TIMESTAMP)
	docker push davnetwork/dav-cassandra:$(TIMESTAMP)
	docker push davnetwork/dav-kafka:$(TIMESTAMP)
	docker push davnetwork/dav-kafka-init:$(TIMESTAMP)
	docker push davnetwork/dav-nginx:$(TIMESTAMP)
	docker push davnetwork/dav-zookeeper:$(TIMESTAMP)
	docker push davnetwork/dav-zookeeper-init:$(TIMESTAMP)

deploy-zookeeper-dev: FORCE
	cd zookeeper && ks apply dev

deploy-zookeeper-prod: FORCE
	cd zookeeper && ks apply prod

remove-zookeeper-dev: FORCE
	cd zookeeper && ks delete dev

remove-zookeeper-prod: FORCE
	cd zookeeper && ks delete prod

deploy-davnn-dev: FORCE
	cd davnn && ks apply dev

deploy-davnn-prod: FORCE
	cd davnn && ks apply prod

remove-davnn-dev: FORCE
	cd davnn && ks delete dev

remove-davnn-prod: FORCE
	cd davnn && ks delete prod

start-proxy: FORCE
	kubectl port-forward --namespace=davnn deployment/davnn 8080:80 9092:9092 7000:7000
