{
  global: {
    davnnNamespace: 'davnn-zookeeper',
  },
  components: {
    // Component-level parameters, defined initially from 'ks prototype use ...'
    // Each object below should correspond to a component in the components/ directory
    namespace: {
    },
    'zookeeper-service': {
    },
    rbac: {
    },
    'zookeeper-configmap': {
    },
    'zookeeper-deployment': {
      davnnNamespace: '',
      resources: { zookeeper: '', 'init-config': '' },
      imagePullSecrets: null,
    },
  },
}
