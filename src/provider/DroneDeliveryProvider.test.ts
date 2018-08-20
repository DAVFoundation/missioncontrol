import { cassandraDriver } from '../mocks/cassandra-driver';
jest.doMock('cassandra-driver', cassandraDriver);
import { DroneDeliveryProvider } from './DroneDeliveryProvider';
import { IDeliveryProvider, INeed } from '../types';

describe('Drone Delivery Provider', () => {
  const provider: IDeliveryProvider = {
    davId: '123',
    topicId: '321',
    protocol: 'drone_delivery',
    area: {
      min: {
        longitude: 1,
        latitude: 1,
      },
      max: {
        longitude: 1,
        latitude: 1,
      },
    },
    dimensions: {
      length: 1,
      width: 1,
      height: 1,
    },
  };

  const need: INeed = {
    davId: '111',
    topicId: '222',
    location: {
      longitude: 1,
      latitude: 1,
    },
    protocol: 'drone_delivery',
  };

  it('should save provider', async () => {
    const droneDeliveryProvider = new DroneDeliveryProvider();
    expect(await droneDeliveryProvider.save(provider)).toBe(true);
  });

  it('should load provider', async () => {
    const droneDeliveryProvider = new DroneDeliveryProvider();
    expect(await droneDeliveryProvider.query(need)).toEqual([provider]);
  });
});
