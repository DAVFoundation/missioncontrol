// ProviderFactory.ts
import { DroneDeliveryProvider } from './DroneDeliveryProvider';
import { IProtocolOptions } from '../types';
import { BaseProvider } from './BaseProvider';

class ProviderFactory {

  // getProviderInstance(protocolOptions: ProtocolOptions): BaseProvider;
  // getProviderInstance(protocolOptions: { protocol:'drone_delivery' }): DroneDeliveryProvider;

  public getProviderInstance(protocolOptions: IProtocolOptions): BaseProvider | DroneDeliveryProvider {
    if (protocolOptions.protocol === 'drone_delivery') {
      const provider = new DroneDeliveryProvider();
      return provider;
    } else {
      throw new Error('Protocol is not implemented');
    }
  }
}

export default new ProviderFactory();
