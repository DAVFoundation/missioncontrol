jest.doMock('redis', () => {
  return {
    RedisClient: Object, 
    createClient: (options) => { // eslint-disable-line no-unused-vars
      return {
        hsetAsync: () => Promise.resolve({  }) // eslint-disable-line no-unused-vars
      };
    }
  };
});