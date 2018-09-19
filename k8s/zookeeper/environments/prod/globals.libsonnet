{
  resources: {
    zookeeper: {
      limits: {
        cpu: '1000m',
        memory: '1Gi',
      },
      requests: {
        cpu: '500m',
        memory: '512Mi',
      },
    },
    'init-config': {
      limits: {
        cpu: '1000m',
        memory: '1Gi',
      },
      requests: {
        cpu: '500m',
        memory: '512Mi',
      },
    },
  },
}
