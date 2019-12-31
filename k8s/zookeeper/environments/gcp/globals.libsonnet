{
  resources: {
    zookeeper: {
      limits: {
        cpu: '1000m',
        memory: '2Gi',
      },
      requests: {
        cpu: '100m',
        memory: '1Gi',
      },
    },
    'init-config': {
      limits: {
        cpu: '1000m',
        memory: '2Gi',
      },
      requests: {
        cpu: '100m',
        memory: '1Gi',
      },
    },
  },
}
