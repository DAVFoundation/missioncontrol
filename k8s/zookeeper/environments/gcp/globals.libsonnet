{
  resources: {
    zookeeper: {
      limits: {
        cpu: '2000m',
        memory: '2Gi',
      },
      requests: {
        cpu: '1000m',
        memory: '1Gi',
      },
    },
    'init-config': {
      limits: {
        cpu: '2000m',
        memory: '2Gi',
      },
      requests: {
        cpu: '1000m',
        memory: '1Gi',
      },
    },
  },
}
