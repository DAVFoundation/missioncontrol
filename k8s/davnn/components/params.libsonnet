local globals = import '../components/globals.libsonnet';
{
  global: globals,
  components: {
    // Component-level parameters, defined initially from 'ks prototype use ...'
    // Each object below should correspond to a component in the components/ directory
    deployment: {
      name: 'davnn',
      resources: { nginx: '', api: '', kafka: { limits: '', requests: { cpu: '', memory: '', storage: '' } }, cassandra: { limits: '', requests: { cpu: '', memory: '', storage: '' } }, 'davnn-init-config': '' },
      SDK_DEBUG_LOG: false,
    },
    service: {
    },
    'kafka-configmap': {
      name: 'kafka-configmap',
    },
    'nginx-configmap': {
      name: 'nginx-configmap',
    },
    'cassandra-storage': {
      storageProvisioner: '',
      storageParameters: '',
    },
    'kafka-storage': {
      storageProvisioner: '',
      storageParameters: '',
    },
  },
}
