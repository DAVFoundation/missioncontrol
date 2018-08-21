import { Request, Response } from 'express';
import ProviderFactory from '../provider/ProviderFactory';
import { BaseProvider } from '../provider/BaseProvider';
import { DroneDeliveryProvider } from '../provider/DroneDeliveryProvider';

// TODO: Need to add tests for this module

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
    const params: any = req.body;
    const providerFactory = new ProviderFactory();
    const provider: BaseProvider = providerFactory.getProviderInstance({ protocol: params.protocol });
    // save record in cassandra
    try {
      const result: boolean = await provider.save({ ...params, topicId});
      if (result === true) {
        res.status(200).send({
          message: 'Provider was saved',
        });
      }
    } catch (err) {
      // tslint:disable-next-line:no-console
      console.log(err);
      res.status(500).send({
        error: `An error ocurred ${err.message || JSON.stringify(err)}`,
      });
    }
  }
}


