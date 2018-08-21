// ProviderFactory.ts
import { DroneDeliveryProvider } from './DroneDeliveryProvider';
import { BoatChargingProvider } from './BoatChargingProvider';
import { IProtocolOptions } from '../types';
import { BaseProvider } from './BaseProvider';

export default class ProviderFactory {

  // getProviderInstance(protocolOptions: ProtocolOptions): BaseProvider;
  // getProviderInstance(protocolOptions: { protocol:'drone_delivery' }): DroneDeliveryProvider;
  private classMap: any = {
    drone_delivery: DroneDeliveryProvider,
    boat_charging: BoatChargingProvider,
  };

  public getProviderInstance(protocolOptions: IProtocolOptions): BaseProvider | DroneDeliveryProvider {
    if (this.classMap[protocolOptions.protocol]) {
      const providerClass = this.classMap[protocolOptions.protocol];
      const provider = new providerClass();
      return provider;
    } else {
      throw new Error('Protocol is not implemented');
    }
  }
}
