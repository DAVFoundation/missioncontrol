import { DroneDeliveryProvider } from "./DroneDeliveryProvider";
import { DeliveryProvider } from "../types";

describe('Drone Delivery Provider', () => {
  let provider: DeliveryProvider;
  beforeEach(() => {
    provider = {
      davId: '123',
      topicId: '321',
      protocol: 'drone_delivery',
      area: {
        min: {
          longitude: 1,
          latitude: 1
        },
        max: {
          longitude: 1,
          latitude: 1
        }
      },
      dimensions: { 
        length: 1,
        width: 1,
        height: 1
      }
    }
  });

  it('should save provider', () => {
    expect.assertions(1);
    let droneDeliveryProvider = new DroneDeliveryProvider();
    expect(droneDeliveryProvider.save(provider)).resolves.toBe(true);
  });
});