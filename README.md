# Mission Control

[![Gitter](https://img.shields.io/gitter/room/DAVFoundation/DAV-Contributors.svg?style=flat-square)](https://gitter.im/DAVFoundation/DAV-Contributors)
[![License](https://img.shields.io/github/license/DAVFoundation/missioncontrol.svg?style=flat-square)](https://github.com/DAVFoundation/missioncontrol/blob/master/LICENSE)

Mission Control is a service running on the DAV network, and serving as a marketplace connecting DAV users, vehicles, and services.

## Deploy

### K8S Cluster

First think you need to do is create and connect to a K8S cluster.
This can be one of various options:
1) A local K8S deployment (e.g. via [minikube](https://kubernetes.io/docs/setup/minikube/))
1) A GCP GKE Cluster.
1) A K8S Cluster deployed on AWS EC2 (e.g. using [kops](https://kubernetes.io/docs/setup/custom-cloud/kops/))
1) An AWS EKS cluster.

* You need to have a local install of kubectl configured to your cluster

### Prepare your K8S cluster

Open a terminal in the project folder and run:
```bash
cd k8s
make deploy-global
```

### Deploy a Zookeeper cluster

At this stage DAVNN pods require a ZK cluster to run.
The cluster should only be created once globally.

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

## Contributing Code, Reporting Bugs and Suggesting Features

As an organization committed to extreme transparency, collaboration, and open-sourcing all of our work, we welcome participation from anyone willing to devote some time and energy to help shape DAV - whether you are a first time contributor, a veteran open-sourcerer, or just looking to suggest some ideas.
