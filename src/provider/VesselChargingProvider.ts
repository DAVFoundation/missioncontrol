import { BaseProvider } from './BaseProvider';
import { IVesselChargingProvider, INeed } from '../types';
import { types } from 'cassandra-driver';
import Cassandra from '../Cassandra';

export class VesselChargingProvider extends BaseProvider {

  private protocol = 'vessel_charging';
  protected tableName = 'providers_vessel_charging';
  protected protocolSpecificFields: string[]   = [
    'max_length',
    'max_width',
    'max_height',
    'max_weight',
  ];

  public async save(provider: IVesselChargingProvider): Promise<boolean> {
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

  public async query(need: INeed): Promise<IVesselChargingProvider[]> {
    const cassandra: Cassandra = await Cassandra.getInstance();
    const result: types.ResultSet = await cassandra.query(this.getReadQuery(), [
      need.data.location.latitude,
      need.data.location.longitude,
      need.data.location.latitude,
      need.data.location.longitude,
    ]);
    const providers: IVesselChargingProvider[] = [];
    for (const providerRow of result) {
      const provider: IVesselChargingProvider = {
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
