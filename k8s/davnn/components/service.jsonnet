local env = std.extVar('__ksonnet/environments');
local params = std.extVar('__ksonnet/params').components.service;
local globals = import '../components/globals.libsonnet';
{
  apiVersion: 'v1',
  kind: 'Service',
  metadata: {
    name: 'davnn',
    namespace: globals.davnnNamespace,
  },
  spec: {
    ports: [
      {
        port: 80,
        name: 'api',
      },
      {
        port: 9092,
        name: '9092',
      },
    ],
    clusterIP: 'None',
    selector: {
      app: 'davnn',
    },
  },
}
