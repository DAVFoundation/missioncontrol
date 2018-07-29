import { Request, Response} from 'express';
import { IProvider } from '../types';
import providerFactory from '../provider/ProviderFactory';
import { BaseProvider } from '../provider/BaseProvider';
import { DroneDeliveryProvider } from '../provider/DroneDeliveryProvider';

/**
 * ProviderController class
 */
class ProviderController {
  /**
   * Register provider for a need type.
   * @param req express Request
   * @param res express Response
   */
  public async needsForType(req: Request, res: Response): Promise<void> {
    const topicId = req.params.topicId;
    const { davId, area, protocol, dimensions } = req.body;

    const provider: BaseProvider = providerFactory.getProviderInstance({ protocol });
    // save record in cassandra
    try {
      let result: boolean = false;
      if (provider instanceof DroneDeliveryProvider) {
        result = await provider.save({
          davId,
          topicId,
          protocol,
          area,
          dimensions,
        });
      }
      if (result === true) {
        res.status(200).send({
          message: 'DAV Network Node',
        });
      } else {
        throw new Error('Error saving provider');
      }
    } catch (err) {
      // tslint:disable-next-line:no-console
      console.log(err);
      res.status(200).send({
        message: JSON.stringify(err),
      });
    }
  }
}

export default new ProviderController();
