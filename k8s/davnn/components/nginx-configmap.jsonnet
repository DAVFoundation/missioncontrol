local env = std.extVar('__ksonnet/environments');
local params = std.extVar('__ksonnet/params').components['nginx-configmap'];

{
  apiVersion: 'v1',
  kind: 'ConfigMap',
  metadata: {
    name: params.name,
    namespace: params.davnnNamespace,
  },
  data: {
    "app.template":importstr "../vendor/nginx/app.template"
  },
}
