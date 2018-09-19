{
  resources: {
    zookeeper: {
      limits: {
        cpu: '1000m',
        memory: '1Gi',
      },
      requests: {
        cpu: '10m',
        memory: '50Mi',
      },
    },
    'init-config': {
      limits: {
        cpu: '1000m',
        memory: '1Gi',
      },
      requests: {
        cpu: '10m',
        memory: '50Mi',
      },
    },
  },
}
