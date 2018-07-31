import { Request, Response} from 'express';
import ProviderFactory from '../provider/ProviderFactory';
import { BaseProvider } from '../provider/BaseProvider';
import { DroneDeliveryProvider } from '../provider/DroneDeliveryProvider';
import { IDeliveryProvider, INeed } from '../types';
import Kafka from '../Kafka';

/**
 * NeedController class
 */
export default class NeedController {
  /**
   * Publish need
   * @param req express Request
   * @param res express Response
   */
  public async publishNeed(req: Request, res: Response) {
    const topicId = req.params.topicId;
    const { davId, location, protocol } = req.body;
    const providerFactory = new ProviderFactory();
    const provider: BaseProvider = providerFactory.getProviderInstance({ protocol });
    // save record in cassandra
    try {
      const need: INeed = {
        davId,
        topicId,
        location,
        protocol,
      };

      if (provider instanceof DroneDeliveryProvider) {
        const results: IDeliveryProvider[] = await provider.query(need);
        if (results.length > 0) {
          const topics: string[] = results.map((result) => {
            return result.topicId;
          });
          Kafka.getInstance().sendMessages(topics, need);
          res.status(200).send({
            message: 'Need was published',
          });
        } else {
          res.status(404).send({
            error: 'No provider were found matching the request',
          });
        }
      }
    } catch (err) {
      res.status(500).send({
        error: `An error ocurred ${JSON.stringify(err)}`,
      });
    }
  }
}
