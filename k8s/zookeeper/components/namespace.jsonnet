local env = std.extVar('__ksonnet/environments');
local params = std.extVar('__ksonnet/params').components.namespace;
{
  apiVersion: 'v1',
  kind: 'Namespace',
  metadata: {
    labels: {
      name: params.davnnNamespace,
    },
    name: params.davnnNamespace,
  },
}
