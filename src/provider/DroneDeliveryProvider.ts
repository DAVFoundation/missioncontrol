import { BaseProvider } from './BaseProvider';
import { IDeliveryProvider, INeed } from '../types';
import { types } from 'cassandra-driver';
import Cassandra from '../Cassandra';

export class DroneDeliveryProvider extends BaseProvider {

  private protocol = 'drone_delivery';
  protected tableName = 'providers_drone_delivery';
  protected protocolSpecificFields: string[]   = [
    'max_length',
    'max_width',
    'max_height',
    'max_weight',
  ];

  public async save(provider: IDeliveryProvider): Promise<boolean> {
    // save cassandra record
    const cassandra: Cassandra = await Cassandra.getInstance();
    return cassandra.save(this.getUpsertQuery(), [
      provider.topicId,
      provider.area.min.latitude,
      provider.area.min.longitude,
      provider.area.max.latitude,
      provider.area.max.longitude,
      provider.dimensions.length,
      provider.dimensions.width,
      provider.dimensions.height,
      provider.dimensions.weight,
    ]);
  }

  public async query(need: INeed): Promise<IDeliveryProvider[]> {
    const cassandra: Cassandra = await Cassandra.getInstance();
    const result: types.ResultSet = await cassandra.query(this.getReadQuery(), [
      need.data.location.latitude,
      need.data.location.longitude,
      need.data.location.latitude,
      need.data.location.longitude,
    ]);

    const providers: IDeliveryProvider[] = [];
    for (const providerRow of result) {
      const provider: IDeliveryProvider = {
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
