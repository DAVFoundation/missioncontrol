local env = std.extVar('__ksonnet/environments');
local params = std.extVar('__ksonnet/params').components['zookeeper-configmap'];
{
  apiVersion: 'v1',
  kind: 'ConfigMap',
  metadata: {
    name: 'zookeeper-configmap',
    namespace: params.davnnNamespace,
  },
  data: {
    'init.sh': importstr '../vendor/init.sh',
    'zookeeper.properties': importstr '../vendor/zookeeper.properties',
    'log4j.properties': importstr '../vendor/log4j.properties',
  },
}
