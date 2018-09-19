local env = std.extVar('__ksonnet/environments');
local params = std.extVar('__ksonnet/params').components['davnn-namespace'];
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
