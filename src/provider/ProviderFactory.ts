// ProviderFactory.ts
import { DroneDeliveryProvider } from './DroneDeliveryProvider';
import { VesselChargingProvider } from './VesselChargingProvider';
import { IProtocolOptions } from '../types';
import { BaseProvider } from './BaseProvider';
import { RideHailingProvider } from './RideHailingProvider';
import { VehicleRiderProvider } from './VehicleRiderProvider';

export default class ProviderFactory {
  // getProviderInstance(protocolOptions: ProtocolOptions): BaseProvider;
  // getProviderInstance(protocolOptions: { protocol:'drone_delivery' }): DroneDeliveryProvider;
  private _classMap: any = {
    drone_delivery: DroneDeliveryProvider,
    vessel_charging: VesselChargingProvider,
    ride_hailing: RideHailingProvider,
    vehicle_rider: VehicleRiderProvider,
  };

  public getProviderInstance(
    protocolOptions: IProtocolOptions,
  ): BaseProvider | DroneDeliveryProvider {
    if (this._classMap[protocolOptions.protocol]) {
      const providerClass = this._classMap[protocolOptions.protocol];
      const provider = new providerClass();
      return provider;
    } else {
      throw new Error(
        `Protocol "${protocolOptions.protocol}" is not implemented`,
      );
    }
  }
}
