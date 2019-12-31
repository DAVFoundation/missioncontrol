{
  SDK_DEBUG_LOG: 'true',
  resources: {
    'davnn-init-config': {
      limits: {
        cpu: '2000m',
        memory: '2Gi',
      },
      requests: {
        cpu: '1000m',
        memory: '1Gi',
      },
    },
    nginx: {
      limits: {
        cpu: '2000m',
        memory: '2Gi',
      },
      requests: {
        cpu: '1000m',
        memory: '1Gi',
      },
    },
    api: {
      limits: {
        cpu: '2000m',
        memory: '2Gi',
      },
      requests: {
        cpu: '1000m',
        memory: '1Gi',
      },
    },
    kafka: {
      limits: {
        cpu: '2000m',
        memory: '2Gi',
      },
      requests: {
        cpu: '1000m',
        memory: '1Gi',
        storage: '1Gi',
      },
    },
    cassandra: {
      limits: {
        cpu: '2000m',
        memory: '2Gi',
      },
      requests: {
        cpu: '1000m',
        memory: '1Gi',
        storage: '1Gi',
      },
    },
  },
}
