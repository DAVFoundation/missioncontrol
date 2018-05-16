const defaultPolicy={
  totalTimeout: 10000,
  socketTimeout:10000,
  maxRetries:10
};

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
      tenderInterval: 10000,
      policies: {
        batch:defaultPolicy,
        info:defaultPolicy,
        operate:defaultPolicy,
        query:defaultPolicy,
        read:defaultPolicy,
        remove:defaultPolicy,
        scan:defaultPolicy,
        write:defaultPolicy
      }
    };
  },
  namespace: 'mission_control'
};
