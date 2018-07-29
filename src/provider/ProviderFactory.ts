// ProviderFactory.ts
import { DroneDeliveryProvider } from './DroneDeliveryProvider';
import { ProtocolOptions } from '../types';
import { BaseProvider } from './BaseProvider';

class ProviderFactory {

  // getProviderInstance(protocolOptions: ProtocolOptions): BaseProvider;
  // getProviderInstance(protocolOptions: { protocol:'drone_delivery' }): DroneDeliveryProvider;

  public getProviderInstance(protocolOptions:ProtocolOptions): BaseProvider | DroneDeliveryProvider {
    if (protocolOptions.protocol === 'drone_delivery') {
      let provider = new DroneDeliveryProvider();
      return provider;
    } else {
      throw new Error('Protocol is not implemented');
    }
  }
}

export default new ProviderFactory();