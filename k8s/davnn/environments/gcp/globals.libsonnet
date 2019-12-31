{
  SDK_DEBUG_LOG: 'true',
  resources: {
    'davnn-init-config': {
      limits: {
        cpu: '1000m',
        memory: '2Gi',
      },
      requests: {
        cpu: '100m',
        memory: '1Gi',
      },
    },
    nginx: {
      limits: {
        cpu: '1000m',
        memory: '2Gi',
      },
      requests: {
        cpu: '100m',
        memory: '1Gi',
      },
    },
    api: {
      limits: {
        cpu: '1000m',
        memory: '2Gi',
      },
      requests: {
        cpu: '100m',
        memory: '1Gi',
      },
    },
    kafka: {
      limits: {
        cpu: '1000m',
        memory: '2Gi',
      },
      requests: {
        cpu: '100m',
        memory: '1Gi',
        storage: '1Gi',
      },
    },
    cassandra: {
      limits: {
        cpu: '1000m',
        memory: '2Gi',
      },
      requests: {
        cpu: '100m',
        memory: '1Gi',
        storage: '1Gi',
      },
    },
  },
}
