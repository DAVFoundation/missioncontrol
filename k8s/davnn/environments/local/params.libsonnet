local params = std.extVar('__ksonnet/params');
local globals = import 'globals.libsonnet';
local envParams = params {
  components+: {
    // Insert component parameter overrides here. Ex:
    // guestbook +: {
    //   name: "guestbook-dev",
    //   replicas: params.global.replicas,
    // },
    'cassandra-storage'+: {
      storageProvisioner: 'k8s.io/minikube-hostpath',
      storageParameters: null,
    },
    'kafka-storage'+: {
      storageProvisioner: 'k8s.io/minikube-hostpath',
      storageParameters: null,
    },
    'kafka-configmap'+: {
      'server.properties': importstr '../../vendor/kafka/local.server.properties',
    },
  },
};

{
  components: {
    [x]: envParams.components[x] + globals
    for x in std.objectFields(envParams.components)
  },
}
