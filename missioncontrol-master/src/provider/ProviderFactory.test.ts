import { cassandraDriver } from '../mocks/cassandra-driver';
jest.doMock('cassandra-driver', cassandraDriver);
import ProviderFactory from './ProviderFactory';
import { DroneDeliveryProvider } from './DroneDeliveryProvider';

describe('Provider Factory', () => {
  it('should initiate correct provider', () => {
    expect.assertions(1);
    const providerFactory = new ProviderFactory();
    expect(providerFactory.getProviderInstance({ protocol: 'drone_delivery'})).toBeInstanceOf(DroneDeliveryProvider);
  });

  it('should throw unimplemented provider', () => {
    const providerFactory = new ProviderFactory();
    const protocolName = 'drone_charging';
    expect(() => providerFactory.getProviderInstance({ protocol: protocolName})).toThrowError(`Protocol "${protocolName}" is not implemented`);
  });
});
