{
  SDK_DEBUG_LOG:'true',
  resources: {
    'davnn-init-config': {
      limits: {
        cpu: '1000m',
        memory: '1Gi',
      },
      requests: {
        cpu: '100m',
        memory: '100Mi',
      },
    },
    nginx: {
      limits: {
        cpu: '1000m',
        memory: '1Gi',
      },
      requests: {
        cpu: '100m',
        memory: '100Mi',
      },
    },
    api: {
      limits: {
        cpu: '1000m',
        memory: '1Gi',
      },
      requests: {
        cpu: '100m',
        memory: '100Mi',
      },
    },
    kafka: {
      limits: {
        cpu: '1000m',
        memory: '1Gi',
      },
      requests: {
        cpu: '100m',
        memory: '100Mi',
      },
    },
    cassandra: {
      limits: {
        cpu: '1000m',
        memory: '1Gi',
      },
      requests: {
        cpu: '100m',
        memory: '512Mi',
      },
    },
  },
}
