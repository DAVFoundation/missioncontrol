SHELL := /bin/bash

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

build: TIMESTAMP=$(shell date +%y%m%d-%H%M -u)
build: FORCE
	@echo Building with timestamp $(TIMESTAMP)
	eval "$$(minikube docker-env)" &&\
		docker build . -f dockers/Dockerfile.api -t davnetwork/api:$(TIMESTAMP) &&\
		docker build . -f dockers/Dockerfile.cassandra -t davnetwork/cassandra:$(TIMESTAMP) &&\
		docker build . -f dockers/Dockerfile.kafka -t davnetwork/kafka:$(TIMESTAMP) &&\
		docker build . -f dockers/Dockerfile.kafka-init -t davnetwork/kafka-init:$(TIMESTAMP) &&\
		docker build . -f dockers/Dockerfile.nginx -t davnetwork/nginx:$(TIMESTAMP) &&\
		docker build . -f dockers/Dockerfile.zookeeper -t davnetwork/zookeeper:$(TIMESTAMP) &&\
		docker build . -f dockers/Dockerfile.zookeeper-init -t davnetwork/zookeeper-init:$(TIMESTAMP)

	pushd k8s/zookeeper && ks show local -o json --ext-str IMAGE_VERSION=$(TIMESTAMP) > ../dist/zookeeper.json && popd
	pushd k8s/davnn && ks show local -o json --ext-str IMAGE_VERSION=$(TIMESTAMP) > ../dist/davnn.json && popd

deploy-zookeeper: FORCE
	kubectl apply -f k8s/dist/zookeeper.json

deploy-davnn: FORCE
	kubectl apply -f k8s/dist/davnn.json

deploy-schema: FORCE
	kubectl exec -n davnn davnn-0 -c api -- bash -c "cqlsh -f schema/keyspace.cql"
	kubectl exec -n davnn davnn-0 -c api -- bash -c "cqlsh -f schema/endpoints.cql"
	kubectl exec -n davnn davnn-0 -c api -- bash -c "cqlsh -f schema/providers.cql"

start-proxy: FORCE
	kubectl port-forward -n davnn statefulset/davnn 8080:80 9092:9092 7000:7000
