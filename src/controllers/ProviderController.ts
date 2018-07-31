import { Request, Response} from 'express';
import ProviderFactory from '../provider/ProviderFactory';
import { BaseProvider } from '../provider/BaseProvider';
import { DroneDeliveryProvider } from '../provider/DroneDeliveryProvider';

/**
 * ProviderController class
 */
export default class ProviderController {
  /**
   * Register provider for a need type.
   * @param req express Request
   * @param res express Response
   */
  public async needsForType(req: Request, res: Response): Promise<void> {
    const topicId = req.params.topicId;
    const { davId, area, protocol, dimensions } = req.body;
    const providerFactory = new ProviderFactory();
    const provider: BaseProvider = providerFactory.getProviderInstance({ protocol });
    // save record in cassandra
    try {
      if (provider instanceof DroneDeliveryProvider) {
        const result: boolean = await provider.save({
          davId,
          topicId,
          protocol,
          area,
          dimensions,
        });
        if (result === true) {
          res.status(200).send({
            message: 'Provider was saved',
          });
        } else {
          res.status(500).send({
            error: 'Error saving provider',
          });
        }
      }
    } catch (err) {
      // tslint:disable-next-line:no-console
      console.log(err);
      res.status(500).send({
        error: `An error ocurred ${JSON.stringify(err)}`,
      });
    }
  }
}
