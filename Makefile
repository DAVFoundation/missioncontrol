FORCE:

SHELL := /bin/bash

tslint: FORCE
	npm run tslint

jest: FORCE
	npm run jest

tsc: FORCE
	npm run tsc

spellcheck: FORCE
	npm run spellcheck

pre-push: tslint tsc jest

KS := docker run --mount type=bind,source="$$(pwd)",target="$$(pwd)" --network host -w "$$(pwd)" docker.pkg.github.com/srfrnk/ksonnet/ks:v0.13.1-19-g8c9f068f

build: TIMESTAMP ?= $(shell date +%Y%m%d-%H%M -u)
build: REGISTRY ?= davnetwork
build: FORCE
	@echo Building with timestamp $(TIMESTAMP)
	eval "$$(minikube docker-env)" &&\
		docker build . -f dockers/Dockerfile.api -t $(REGISTRY)/api:$(TIMESTAMP) &&\
		docker build . -f dockers/Dockerfile.cassandra -t $(REGISTRY)/cassandra:$(TIMESTAMP) &&\
		docker build . -f dockers/Dockerfile.kafka -t $(REGISTRY)/kafka:$(TIMESTAMP) &&\
		docker build . -f dockers/Dockerfile.kafka-init -t $(REGISTRY)/kafka-init:$(TIMESTAMP) &&\
		docker build . -f dockers/Dockerfile.nginx -t $(REGISTRY)/nginx:$(TIMESTAMP) &&\
		docker build . -f dockers/Dockerfile.zookeeper -t $(REGISTRY)/zookeeper:$(TIMESTAMP) &&\
		docker build . -f dockers/Dockerfile.zookeeper-init -t $(REGISTRY)/zookeeper-init:$(TIMESTAMP)
	pushd k8s/zookeeper && $(KS) show local -o json --ext-str IMAGE_VERSION=$(TIMESTAMP) --ext-str REGISTRY=$(REGISTRY) > ../dist/zookeeper-$(TIMESTAMP).json && popd
	pushd k8s/davnn && $(KS) show local -o json --ext-str IMAGE_VERSION=$(TIMESTAMP) --ext-str REGISTRY=$(REGISTRY) > ../dist/davnn-$(TIMESTAMP).json && popd
	cp k8s/dist/zookeeper-$(TIMESTAMP).json k8s/dist/zookeeper.json
	cp k8s/dist/davnn-$(TIMESTAMP).json k8s/dist/davnn.json

push-images: FORCE
	docker push $(REGISTRY)/api:$(TIMESTAMP)
	docker push $(REGISTRY)/cassandra:$(TIMESTAMP)
	docker push $(REGISTRY)/kafka:$(TIMESTAMP)
	docker push $(REGISTRY)/kafka-init:$(TIMESTAMP)
	docker push $(REGISTRY)/nginx:$(TIMESTAMP)
	docker push $(REGISTRY)/zookeeper:$(TIMESTAMP)
	docker push $(REGISTRY)/zookeeper-init:$(TIMESTAMP)

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
