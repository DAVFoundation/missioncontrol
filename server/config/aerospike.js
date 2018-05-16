module.exports = {
  aerospikeConfig: () => {
    const address = process.env.AEROSPIKE_HOST || 'aerospike';
    return {
      hosts: [{
        addr: address,
        port: 3000
      }],
      connTimeoutMs: 10000,
      loginTimeoutMs: 10000,
      policies: {
        read: {
          maxRetries: 100,
          socketTimeout: 10000,
          totalTimeout: 10000,
        },
        write: {
          maxRetries: 100,
          socketTimeout: 10000,
          totalTimeout: 10000,
        },
        scan: {
          maxRetries: 100,
          socketTimeout: 10000,
          totalTimeout: 10000,
        },
        query: {
          maxRetries: 100,
          socketTimeout: 10000,
          totalTimeout: 10000,
        },
      }
    };
  },
  namespace: 'mission_control'
};
