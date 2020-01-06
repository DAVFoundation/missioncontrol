local env = std.extVar('__ksonnet/environments');
local params = std.extVar('__ksonnet/params').components['kafka-configmap'];
local globals = import '../components/globals.libsonnet';
{
  apiVersion: 'v1',
  kind: 'ConfigMap',
  metadata: {
    name: params.name,
    namespace: globals.davnnNamespace,
  },
  data: {
    'init.sh': importstr '../vendor/kafka/init.sh',
    'server.properties': params['server.properties'],
    'log4j.properties': importstr '../vendor/kafka/log4j.properties',
  },
}
