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
      storageProvisioner: 'kubernetes.io/gce-pd',
      storageParameters: {
        type: 'pd-standard',
      },
    },
    'kafka-storage'+: {
      storageProvisioner: 'kubernetes.io/gce-pd',
      storageParameters: {
        type: 'pd-standard',
      },
    },
    deployment+: {
      imagePullSecrets: [{
        name: 'registrykey',
      }],
    },
  },
};

{
  components: {
    [x]: envParams.components[x] + globals
    for x in std.objectFields(envParams.components)
  },
}
