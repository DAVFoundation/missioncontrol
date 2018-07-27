
import providerFactory from "./ProviderFactory";
import { DroneDeliveryProvider } from "./DroneDeliveryProvider";

describe('Provider Factory', () => {
  it('should initiate correct provider', () => {
    expect.assertions(1);
    expect(providerFactory.getProviderInstance({ protocol: 'drone_delivery'})).toBeInstanceOf(DroneDeliveryProvider);
  });

  it('should throw unimplemented provider', () => {
    // expect.assertions(1);
    // expect(() => {throw new Error()}).toThrow();
    // let providerFactory = new ProviderFactory();
    expect(providerFactory.getProviderInstance({ protocol: 'drone_charging'})).toThrowError('Protocol is not implemented');
  });
});