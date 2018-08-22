// ProviderFactory.ts
import { DroneDeliveryProvider } from './DroneDeliveryProvider';
import { BoatChargingProvider } from './BoatChargingProvider';
import { IProtocolOptions } from '../types';
import { BaseProvider } from './BaseProvider';
import { RideHailingProvider } from './RideHailingProvider';

export default class ProviderFactory {

  // getProviderInstance(protocolOptions: ProtocolOptions): BaseProvider;
  // getProviderInstance(protocolOptions: { protocol:'drone_delivery' }): DroneDeliveryProvider;
  private _classMap: any = {
    drone_delivery: DroneDeliveryProvider,
    boat_charging: BoatChargingProvider,
    ride_hailing: RideHailingProvider,
  };

  public getProviderInstance(protocolOptions: IProtocolOptions): BaseProvider | DroneDeliveryProvider {
    if (this._classMap[protocolOptions.protocol]) {
      const providerClass = this._classMap[protocolOptions.protocol];
      const provider = new providerClass();
      return provider;
    } else {
      throw new Error('Protocol is not implemented');
    }
  }
}
