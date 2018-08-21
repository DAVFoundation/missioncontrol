import { BaseProvider } from './BaseProvider';
import { IProvider, INeed } from '../types';
import { types } from 'cassandra-driver';
import Cassandra from '../Cassandra';

export class BoatChargingProvider extends BaseProvider {

  private protocol = 'boat_charging';
  protected tableName = 'providers_boat_charging';

  public async save(provider: IProvider): Promise<boolean> {
    // save cassandra record
    const cassandra: Cassandra = await Cassandra.getInstance();
    return cassandra.save(this.getUpsertQuery(), [
      provider.davId,
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
        davId: providerRow.dav_id,
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
