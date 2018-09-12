deploy:
	kubectl create configmap zookeeper-config --from-file=init.sh --from-file=zookeeper.properties --from-file=log4j.properties -o yaml
	kubectl apply -f zk-svc.json
	kubectl apply -f zk-deployment.json

remove:
	kubectl delete configmap zookeeper-config
	kubectl delete deployment zk
	kubectl delete service zookeeper