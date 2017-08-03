const client = require('../../server/client-thrift.js');
const connection = client.start();

test('is_registered to return false', async () => {
  expect.assertions(1);
  await client
    .getClient()
    .is_registered()
    .then(response => {
      connection.end();
      expect(response).toBe(false);
    });
});
