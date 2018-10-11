# Mission Control

[![Gitter](https://img.shields.io/gitter/room/DAVFoundation/DAV-Contributors.svg?style=flat-square)](https://gitter.im/DAVFoundation/DAV-Contributors)
[![License](https://img.shields.io/github/license/DAVFoundation/missioncontrol.svg?style=flat-square)](https://github.com/DAVFoundation/missioncontrol/blob/master/LICENSE)

Mission Control is a service running on the DAV network, and serving as a marketplace connecting DAV users, vehicles, and services.

## Deploy

### Kubernetes (K8S) Cluster

First thing you need to do is create and connect to a Kubernetes (K8S) cluster.
This can be one of various options:
1) A local K8S deployment (e.g. via [minikube](https://kubernetes.io/docs/setup/minikube/))
1) A GCP GKE Cluster.
1) A K8S Cluster deployed on AWS EC2 (e.g. using [kops](https://kubernetes.io/docs/setup/custom-cloud/kops/))
1) An AWS EKS cluster.

* You need to have a local install of kubectl configured to operate your cluster

### Prepare your K8S cluster

Open a terminal in the project folder and run:
```bash
cd k8s
make deploy-global
```

### Deploy a Zookeeper cluster
** **This step should be done once per DAVNN cluster** **

At this stage DAVNN pods require a ZK cluster to run.

Open a terminal in the project folder and run:
```bash
cd k8s
```

If deploying a local(dev) version - run:
```bash
make deploy-zookeeper-dev
```

If deploying a cloud(prod) version - run:
```bash
make deploy-zookeeper-prod
```

Wait until the ZK cluster is active.

### Deploy a DAVNN pod

Open a terminal in the project folder and run:
```bash
cd k8s
```

If deploying a local(dev) version - run:
```bash
make deploy-davnn-dev
```

If deploying a cloud(prod) version - run:
```bash
make deploy-davnn-prod
```

Wait until your DAVNN pod is active.

### Create schema
** **This step should be done once per DAVNN cluster** **

Find your pod id:
```bash
kubectl get pods --namespace=davnn
```

Your should see something like this:
```bash
NAME                     READY     STATUS    RESTARTS   AGE
davnn-7bf6f57c4b-6zxg7   4/4       Running   0          25m
zookeeper-0              1/1       Running   0          30m
zookeeper-1              1/1       Running   0          29m
zookeeper-2              1/1       Running   0          29m
```

The `davnn-7bf6f57c4b-6zxg7` is your DAVNN pod - copy this id for the next step.

Connect to the DAVNN pod `api` container via SSH.
E.g.:
```bash
kubectl exec -it --namespace=davnn davnn-<POD_ID> -c api bash
```

When connected run the deploy-schema command:
```bash
make deploy-schema
```

### Use a local proxy

Sometimes it's easier to debug local scripts using a local proxy.
To run a local proxy that connects to your deployed pod run the following:
```bash
make proxy
```

## Contributing Code, Reporting Bugs and Suggesting Features

As an organization committed to extreme transparency, collaboration, and open-sourcing all of our work, we welcome participation from anyone willing to devote some time and energy to help shape DAV - whether you are a first time contributor, a veteran open-sourcerer, or just looking to suggest some ideas.
