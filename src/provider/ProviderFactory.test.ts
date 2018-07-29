import { cassandraDriver } from '../mocks/cassandra-driver';
jest.doMock('cassandra-driver', cassandraDriver);
import providerFactory from './ProviderFactory';
import { DroneDeliveryProvider } from './DroneDeliveryProvider';

describe('Provider Factory', () => {
  it('should initiate correct provider', () => {
    expect.assertions(1);
    expect(providerFactory.getProviderInstance({ protocol: 'drone_delivery'})).toBeInstanceOf(DroneDeliveryProvider);
  });

  it('should throw unimplemented provider', () => {
    expect(() => providerFactory.getProviderInstance({ protocol: 'drone_charging'})).toThrowError('Protocol is not implemented');
  });
});
