const { start, vehicleIsRegistered } = require('../../../server/client-thrift.js');

let connection;

beforeAll(() => {
  // Start thrift client
  connection = start();
});

afterAll(() => {
  // End thrift client
  connection.end();
});

test('vehicle_is_registered to return false', async () => {
  expect.assertions(1);
  await vehicleIsRegistered().then(
    response => {
      expect(response).toBe(false);
    });
});
