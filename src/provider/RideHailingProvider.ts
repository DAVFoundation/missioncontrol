import { BaseProvider } from './BaseProvider';
import { IProvider, INeed } from '../types';
import { types } from 'cassandra-driver';
import Cassandra from '../Cassandra';

export class RideHailingProvider extends BaseProvider {

  private protocol = 'ride_hailing';
  protected tableName = 'providers_ride_hailing';

  public async save(provider: IProvider): Promise<boolean> {
    // save cassandra record
    const cassandra: Cassandra = await Cassandra.getInstance();
    return cassandra.save(this.getUpsertQuery(), [
      provider.topicId,
      provider.area.min.latitude,
      provider.area.min.longitude,
      provider.area.max.latitude,
      provider.area.max.longitude,
    ]);
  }

  public async query(need: INeed): Promise<IProvider[]> {
    const cassandra: Cassandra = await Cassandra.getInstance();
    const result: types.ResultSet = await cassandra.query(this.getReadQuery(), [
      need.location.latitude,
      need.location.longitude,
      need.location.latitude,
      need.location.longitude,
    ]);

    const providers: IProvider[] = [];
    for (const providerRow of result) {
      const provider: IProvider = {
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
      };
      providers.push(provider);
    }
    return providers;
  }
}
