import { cassandraDriver } from '../mocks/cassandra-driver';
jest.doMock('cassandra-driver', cassandraDriver);
import { RideHailingProvider } from './RideHailingProvider';
import { IDeliveryProvider, INeed } from '../types';

describe('Ride Hailing Provider', () => {
  const provider: IDeliveryProvider = {
    topicId: '321',
    protocol: 'ride_hailing',
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

  it('should save provider', async () => {
      const rideHailingProvider = new RideHailingProvider();
      expect(await rideHailingProvider.save(provider)).toBe(true);
  });
});
