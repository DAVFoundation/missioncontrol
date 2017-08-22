const client = require('../../../server/client-thrift.js');
let connection;

beforeAll(() => {
  connection = client.start();
});

afterAll(() => {
  connection.end();
});


test('vehicle_is_registered to return false', async () => {
  expect.assertions(1);
  await client
    .getClient('Registration')
    .vehicle_is_registered()
    .then(response => {
      expect(response).toBe(false);
    });
});
