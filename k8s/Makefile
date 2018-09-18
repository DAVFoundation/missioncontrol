FORCE:

build: FORCE
	docker build ../. -f ../dockers/Dockerfile.api -t davnetwork/dav-api
	docker build ../. -f ../dockers/Dockerfile.cassandra -t davnetwork/dav-cassandra
	docker build ../. -f ../dockers/Dockerfile.kafka -t davnetwork/dav-kafka
	docker build ../. -f ../dockers/Dockerfile.kafka-init -t davnetwork/dav-kafka-init
	docker build ../. -f ../dockers/Dockerfile.nginx -t davnetwork/dav-nginx
	docker build ../. -f ../dockers/Dockerfile.zookeeper -t davnetwork/dav-zookeeper
	docker build ../. -f ../dockers/Dockerfile.zookeeper-init -t davnetwork/dav-zookeeper-init

	docker push davnetwork/dav-api
	docker push davnetwork/dav-cassandra
	docker push davnetwork/dav-kafka
	docker push davnetwork/dav-kafka-init
	docker push davnetwork/dav-nginx
	docker push davnetwork/dav-zookeeper
	docker push davnetwork/dav-zookeeper-init

deploy-zookeeper: FORCE
	kubectl create configmap --namespace=davnn zookeeper-configmap --from-file=zookeeper/init.sh --from-file=zookeeper/zookeeper.properties --from-file=zookeeper/log4j.properties
	kubectl apply -f zookeeper/zk-svc.json
	kubectl apply -f zookeeper/zk-deployment.json

deploy-zookeeper-dev: deploy-zookeeper
	kubectl patch -f zookeeper/zk-deployment.json -p "$$(cat zookeeper/zk-deployment.dev.json)"

deploy-zookeeper-prod: deploy-zookeeper
	kubectl patch -f zookeeper/zk-deployment.json -p "$$(cat zookeeper/zk-deployment.prod.json)"

remove-zookeeper: FORCE
	kubectl delete configmap --namespace=davnn zookeeper-configmap
	kubectl delete -f zookeeper/zk-deployment.json
	kubectl delete -f zookeeper/zk-svc.json

deploy-davnn: FORCE
	kubectl create configmap --namespace=davnn kafka-configmap \
		--from-file=davnn/kafka/init.sh \
		--from-file=davnn/kafka/server.properties \
		--from-file=davnn/kafka/log4j.properties
	kubectl create configmap --namespace=davnn nginx-configmap \
		--from-file=davnn/nginx/app.template
	kubectl apply -f davnn/davnn-deployment.json

deploy-davnn-dev: deploy-davnn
	kubectl patch -f davnn/davnn-deployment.json -p "$$(cat davnn/davnn-deployment.dev.json)"

deploy-davnn-prod: deploy-davnn
	kubectl patch -f davnn/davnn-deployment.json -p "$$(cat davnn/davnn-deployment.prod.json)"

remove-davnn: FORCE
	kubectl delete -f davnn/davnn-deployment.json
	kubectl delete configmap --namespace=davnn kafka-configmap
	kubectl delete configmap --namespace=davnn nginx-configmap

deploy-global: FORCE
	kubectl apply -f namespace.json
	kubectl apply -f davnn-rbac.json

remove-global: FORCE
	kubectl delete -f davnn-rbac.json
	kubectl delete -f namespace.json

start-proxy: FORCE
	kubectl port-forward --namespace=davnn deployment/davnn 8080:80 9092:9092 7000:7000
