deploy:
	kubectl create configmap davnn-config --from-file=init.sh --from-file=server.properties --from-file=log4j.properties -o yaml
	# kubectl apply -f zk-svc.json
	kubectl apply -f davnn.json

remove:
	kubectl delete configmap broker-config
	kubectl delete deployment davnn
	# kubectl delete service zk-svc

deploy-nginx:
	kubectl create configmap nginx-config --from-file=../../nginx/app.template -o yaml
	kubectl apply -f nginx.yaml

remove-nginx:
	kubectl delete configmap nginx-config
	kubectl delete deployment nginx-demo