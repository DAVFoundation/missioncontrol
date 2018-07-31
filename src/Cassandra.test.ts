import { cassandraDriver, cassandraFailingToConnectDriver } from './mocks/cassandra-driver';

describe('cassandra', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.resetModules();
  });

  it('should connect', async () => {
    expect.assertions(1);
    jest.doMock('cassandra-driver', cassandraDriver);
    const { Cassandra } = (await import('./Cassandra'));
    const cassandra = await Cassandra.getInstance();
    expect(cassandra.isConnected()).toEqual(true);
  });

  it('should not connect', async () => {
    expect.assertions(1);
    jest.doMock('cassandra-driver', cassandraFailingToConnectDriver);
    const { Cassandra } = (await import('./Cassandra'));
    await expect(Cassandra.getInstance()).rejects.toEqual(Error('Cassandra connection error: false'));
  });

  it('should save record', async () => {
    expect.assertions(1);
    jest.doMock('cassandra-driver', cassandraDriver);
    const { Cassandra } = (await import('./Cassandra'));
    const cassandra = await Cassandra.getInstance();
    expect(await cassandra.save('INSERT INTO table (key, value) VALUES (?, ?)', ['key', 'value'])).toEqual(true);
  });

});
