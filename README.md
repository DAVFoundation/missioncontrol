# Mission Control

[![Gitter](https://img.shields.io/gitter/room/DAVFoundation/DAV-Contributors.svg?style=flat-square)](https://gitter.im/DAVFoundation/DAV-Contributors)
[![License](https://img.shields.io/github/license/DAVFoundation/missioncontrol.svg?style=flat-square)](https://github.com/DAVFoundation/missioncontrol/blob/master/LICENSE)

Mission Control is a service running on the DAV network, and serving as a marketplace connecting DAV users, vehicles, and services.

## Deploy (Distributed Build)

- Find your requested build version from these [Distributions](https://github.com/DAVFoundation/missioncontrol/tree/master/k8s/dist)
- The distributions are listed with following format: `davnn-[VERSION].json`
- Connect the kubectl environment to your K8s cluster.
- Run just once for a DAVNN network `kubectl apply -f https://raw.githubusercontent.com/DAVFoundation/missioncontrol/master/k8s/dist/zookeeper-[VERSION].json` (Replace VERSION with any valid distribution version)
- Run per DAVNN node cluster `kubectl apply -f https://raw.githubusercontent.com/DAVFoundation/missioncontrol/master/k8s/dist/davnn-[VERSION].json` (Replace VERSION with any valid distribution version)
- Run just once for a DAVNN network:
  - `kubectl exec -n davnn davnn-0 -c api -- bash -c "cqlsh -f schema/keyspace.cql"`
  - `kubectl exec -n davnn davnn-0 -c api -- bash -c "cqlsh -f schema/endpoints.cql"`
  - `kubectl exec -n davnn davnn-0 -c api -- bash -c "cqlsh -f schema/providers.cql"`

## Deploy (Local Build)

### Kubernetes (K8S) Cluster

The first thing you need to do is create and connect to a Kubernetes (K8S) cluster.
This can be one of the various options:

1. A local K8S deployment (e.g. via [minikube](https://kubernetes.io/docs/setup/minikube/))
1. A GCP GKE Cluster
1. A K8S Cluster deployed on AWS EC2 (e.g. using [kops](https://kubernetes.io/docs/setup/custom-cloud/kops/))
1. An AWS EKS cluster

- You need to have a local [install of kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/) configured to operate your cluster.

### Build images

Open a terminal in the project folder and run:

```bash
make build
```

### Deploy a Zookeeper cluster

\*\* **This step should be done once per DAVNN cluster** \*\*

At this stage, DAVNN pods require a ZK cluster to run.

Open a terminal in the project folder and run:

```bash
make deploy-zookeeper
```

Wait until the ZK cluster is active.

### Deploy a DAVNN pod

Open a terminal in the project folder and run:

```bash
make deploy-davnn
```

Wait until your DAVNN pod is active.

### Create schema

\*\* **This step should be done once per DAVNN cluster** \*\*

Open a terminal in the project folder and run:

```bash
make deploy-schema
```

### Use a local proxy

Sometimes it's easier to debug local scripts using a local proxy.
To run a local proxy that connects to your deployed pod run the following:

```bash
make start-proxy
```

## Contributing Code, Reporting Bugs and Suggesting Features

As an organization committed to extreme transparency, collaboration, and open-sourcing all of our work, we welcome participation from anyone willing to devote some time and energy to help shape DAV - whether you are a first-time contributor, a veteran open-sourcerer, or just looking to suggest some ideas.
