import { BaseProvider } from "./BaseProvider";
import { DeliveryProvider } from "../types";
import cassandra from '../Cassandra';
import { types } from "cassandra-driver";

export class DroneDeliveryProvider extends BaseProvider {

  protected tableName = 'providers_drone_delivery';
  private protocol = 'drone_delivery';
  protected protocolSpecificFields: Array<string> = [
    'max_length',
    'max_width',
    'max_height',

  ];
  public async save(provider: DeliveryProvider): Promise<boolean> {
    //save cassandra record
    return cassandra.save(this.getUpsertQuery(), [
      provider.davId,
      provider.topicId,
      provider.area.min.latitude,
      provider.area.min.longitude,
      provider.area.max.latitude,
      provider.area.max.longitude,
      provider.dimensions.length,
      provider.dimensions.width,
      provider.dimensions.height
    ])
  }
  
  public async query(need: any): Promise<DeliveryProvider> {
    try {
      let result = await cassandra.query(this.getReadQuery(), [
        need.location.latitude,
        need.location.longitude,
        need.location.latitude,
        need.location.longitude,
        need.serviceType,
      ]);
      let providerRow: types.Row = result.first();
      if(providerRow) {
        let provider: DeliveryProvider = {
          davId: providerRow['dav_id'],
          topicId: providerRow['topic_id'],
          protocol: this.protocol,
          area: {
            min: {
              longitude: providerRow['min_lat'],
              latitude: providerRow['min_long']
            },
            max: {
              longitude: providerRow['max_lat'],
              latitude: providerRow['max_long']
            }
          },
          dimensions: { 
            length: providerRow['max_length'],
            width: providerRow['max_width'],
            height: providerRow['max_height']
          }
        }
        return provider;
      }
    } catch(err) {
      console.log(err);
      throw err;
    }
  }
}