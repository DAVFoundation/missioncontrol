local env = std.extVar('__ksonnet/environments');
local params = std.extVar('__ksonnet/params').components['zookeeper-service'];
//
//     ks prototype use service --targetLabelSelector "{app: 'nginx'}" [...]
{
  apiVersion: 'v1',
  kind: 'Service',
  metadata: {
    name: 'zookeeper',
    namespace: params.davnnNamespace,
    labels: {
      app: 'zookeeper',
    },
  },
  spec: {
    ports: [
      {
        port: 2888,
        name: 'server',
      },
      {
        port: 3888,
        name: 'leader-election',
      },
      {
        port: 2181,
        name: 'client',
      },
    ],
    clusterIP: 'None',
    selector: {
      app: 'zookeeper',
    },
  },
}
