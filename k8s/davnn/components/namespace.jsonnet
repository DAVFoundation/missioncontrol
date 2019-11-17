local env = std.extVar('__ksonnet/environments');
local params = std.extVar('__ksonnet/params').components.namespace;
local globals = import '../components/globals.libsonnet';
{
  apiVersion: 'v1',
  kind: 'Namespace',
  metadata: {
    labels: {
      name: globals.davnnNamespace,
    },
    name: globals.davnnNamespace,
  },
}
