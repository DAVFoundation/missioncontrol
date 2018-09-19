{
  resources: {
    'davnn-init-config': {
      limits: {
        cpu: '1000m',
        memory: '1Gi',
      },
      requests: {
        cpu: '500m',
        memory: '512Mi',
      },
    },
    nginx: {
      limits: {
        cpu: '1000m',
        memory: '1Gi',
      },
      requests: {
        cpu: '500m',
        memory: '512Mi',
      },
    },
    api: {
      limits: {
        cpu: '1000m',
        memory: '1Gi',
      },
      requests: {
        cpu: '500m',
        memory: '512Mi',
      },
    },
    kafka: {
      limits: {
        cpu: '1000m',
        memory: '1Gi',
      },
      requests: {
        cpu: '500m',
        memory: '512Mi',
      },
    },
    cassandra: {
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
