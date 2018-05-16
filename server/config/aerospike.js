module.exports = {
  aerospikeConfig: () => {
    const address = process.env.AEROSPIKE_HOST || 'aerospike';
    return {
      hosts: [{addr: address, port: 3000}],
    };
  },
  namespace: 'mission_control'
};
