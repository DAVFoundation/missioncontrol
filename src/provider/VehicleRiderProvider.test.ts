import { cassandraDriver } from '../mocks/cassandra-driver';
jest.doMock('cassandra-driver', cassandraDriver);
import { VehicleRiderProvider } from './VehicleRiderProvider';
import { IDeliveryProvider, INeed } from '../types';

describe('Vehicle Rider Provider', () => {
  const provider: IDeliveryProvider = {
    topicId: '321',
    protocol: 'vehicle_rider',
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
  };

  const need: INeed = {
    topicId: '222',
    protocol: 'vehicle_rider',
    data: {
      location: {
        longitude: 1,
        latitude: 1,
      },
    },
  };

  it('should save provider', async () => {
    const vehicleRiderProvider = new VehicleRiderProvider();
    expect(await vehicleRiderProvider.save(provider)).toBe(true);
  });

  it('should load provider', async () => {
    const vehicleRiderProvider = new VehicleRiderProvider();
    expect(await vehicleRiderProvider.query(need)).toEqual([provider]);
  });
});
