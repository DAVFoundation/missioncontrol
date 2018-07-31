import { cassandraDriver, cassandraFailingToConnectDriver } from './mocks/cassandra-driver';

describe('cassandra', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.resetModules();
  });

  it('should connect', async () => {
    expect.assertions(1);
    jest.doMock('cassandra-driver', cassandraDriver);
    const cassandra = (await import('./Cassandra')).default;
    const cassandraInstance = await cassandra.getInstance();
    expect(cassandraInstance.isConnected()).toEqual(true);
  });

  it('should not connect', async () => {
    expect.assertions(1);
    jest.doMock('cassandra-driver', cassandraFailingToConnectDriver);
    const cassandraInstance = (await import('./Cassandra')).default;
    await expect(cassandraInstance.getInstance()).rejects.toEqual(Error('Cassandra connection error: false'));
  });

  it('should save record', async () => {
    expect.assertions(1);
    jest.doMock('cassandra-driver', cassandraDriver);
    const cassandra = (await import('./Cassandra')).default;
    const cassandraInstance = await cassandra.getInstance();
    expect(await cassandraInstance.save('INSERT INTO table (key, value) VALUES (?, ?)', ['key', 'value'])).toEqual(true);
  });

});
