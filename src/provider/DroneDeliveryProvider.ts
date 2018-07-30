import { BaseProvider } from './BaseProvider';
import { IDeliveryProvider, INeed } from '../types';
import { Cassandra } from '../Cassandra';
import { types } from 'cassandra-driver';

export class DroneDeliveryProvider extends BaseProvider {

  protected tableName = 'providers_drone_delivery';
  protected protocolSpecificFields: string[]   = [
    'max_length',
    'max_width',
    'max_height',

  ];
  private protocol = 'drone_delivery';
  public async save(provider: IDeliveryProvider): Promise<boolean> {
    // save cassandra record
    const cassandra: Cassandra = await Cassandra.getInstance();
    return cassandra.save(this.getUpsertQuery(), [
      provider.davId,
      provider.topicId,
      provider.area.min.latitude,
      provider.area.min.longitude,
      provider.area.max.latitude,
      provider.area.max.longitude,
      provider.dimensions.length,
      provider.dimensions.width,
      provider.dimensions.height,
    ]);
  }

  public async query(need: INeed): Promise<IDeliveryProvider[]> {
    const cassandra: Cassandra = await Cassandra.getInstance();
    try {
      const result: types.ResultSet = await cassandra.query(this.getReadQuery(), [
        need.location.latitude,
        need.location.longitude,
        need.location.latitude,
        need.location.longitude,
      ]);

      const providers: IDeliveryProvider[] = [];
      for (const providerRow of result) {
        const provider: IDeliveryProvider = {
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
          dimensions: {
            length: providerRow.max_length,
            width: providerRow.max_width,
            height: providerRow.max_height,
          },
        };
        providers.push(provider);
      }
      return providers;
    } catch (err) {
      // tslint:disable-next-line:no-console
      console.log(err);
      throw err;
    }
  }
}
