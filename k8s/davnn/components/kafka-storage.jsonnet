local env = std.extVar('__ksonnet/environments');
local globals = import '../components/globals.libsonnet';
local params = std.extVar('__ksonnet/params').components['kafka-storage'];
{
  kind: 'StorageClass',
  apiVersion: 'storage.k8s.io/v1',
  metadata: {
    name: 'kafka-storage',
    namespace: globals.davnnNamespace,
  },
  reclaimPolicy: 'Retain',
  provisioner: params.storageProvisioner,
  parameters: params.storageParameters,
}
