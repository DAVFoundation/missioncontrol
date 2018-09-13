import { BaseProvider } from './BaseProvider';
import { IBoatChargingProvider, INeed } from '../types';
import { types } from 'cassandra-driver';
import Cassandra from '../Cassandra';

export class BoatChargingProvider extends BaseProvider {

  private protocol = 'boat_charging';
  protected tableName = 'providers_boat_charging';
  protected protocolSpecificFields: string[]   = [
    'max_length',
    'max_width',
    'max_height',
    'max_weight',
  ];

  public async save(provider: IBoatChargingProvider): Promise<boolean> {
    // save cassandra record
    const cassandra: Cassandra = await Cassandra.getInstance();
    return cassandra.save(this.getUpsertQuery(), [
      provider.topicId,
      provider.area.min.latitude,
      provider.area.min.longitude,
      provider.area.max.latitude,
      provider.area.max.longitude,
      provider.dimensions && provider.dimensions.length,
      provider.dimensions && provider.dimensions.width,
      provider.dimensions && provider.dimensions.height,
      provider.dimensions && provider.dimensions.weight,
    ]);
  }

  public async query(need: INeed): Promise<IBoatChargingProvider[]> {
    const cassandra: Cassandra = await Cassandra.getInstance();
    const result: types.ResultSet = await cassandra.query(this.getReadQuery(), [
      need.data.location.latitude,
      need.data.location.longitude,
      need.data.location.latitude,
      need.data.location.longitude,
    ]);
    const providers: IBoatChargingProvider[] = [];
    for (const providerRow of result) {
      const provider: IBoatChargingProvider = {
        topicId: providerRow.topic_id,
        protocol: this.protocol,
        area: {
          min: {
            longitude: providerRow.min_lat,
            latitude: providerRow.min_long,
          },
          max: {
            longitude: providerRow.max_lat,
            latitude: providerRow.max_long,
          },
        },
        dimensions: {
          length: providerRow.max_length,
          width: providerRow.max_width,
          height: providerRow.max_height,
          weight: providerRow.max_weight,
        },
      };
      providers.push(provider);
    }
    return providers;
  }
}
