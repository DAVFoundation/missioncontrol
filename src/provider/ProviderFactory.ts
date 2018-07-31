// ProviderFactory.ts
import { DroneDeliveryProvider } from './DroneDeliveryProvider';
import { IProtocolOptions } from '../types';
import { BaseProvider } from './BaseProvider';

export default class ProviderFactory {

  // getProviderInstance(protocolOptions: ProtocolOptions): BaseProvider;
  // getProviderInstance(protocolOptions: { protocol:'drone_delivery' }): DroneDeliveryProvider;
  private classMap = new Map([
    ['drone_delivery', DroneDeliveryProvider],
  ]);

  public getProviderInstance(protocolOptions: IProtocolOptions): BaseProvider | DroneDeliveryProvider {
    if (this.classMap.has(protocolOptions.protocol)) {
      const providerClass = this.classMap.get(protocolOptions.protocol);
      const provider = new providerClass();
      return provider;
    } else {
      throw new Error('Protocol is not implemented');
    }
  }
}

