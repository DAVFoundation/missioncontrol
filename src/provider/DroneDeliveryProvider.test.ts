import { cassandraDriver } from '../mocks/cassandra-driver';
jest.doMock('cassandra-driver', cassandraDriver);
import { DroneDeliveryProvider } from './DroneDeliveryProvider';
import { IDeliveryProvider } from '../types';

describe('Drone Delivery Provider', () => {
  let provider: IDeliveryProvider;
  const need = {
    location: {
      longitude: 1,
      latitude: 1,
    },
    protocol: 'drone_delivery',
  };
  beforeEach(() => {
    provider = {
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
  });

  it('should save provider', () => {
    const droneDeliveryProvider = new DroneDeliveryProvider();
    expect(droneDeliveryProvider.save(provider)).resolves.toBe(true);
  });

  it('should load provider', async () => {
    const droneDeliveryProvider = new DroneDeliveryProvider();
    expect(droneDeliveryProvider.query(need)).resolves.toEqual(provider);
  });
});
