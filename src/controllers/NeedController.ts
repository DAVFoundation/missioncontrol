import { Request, Response} from 'express';
import providerFactory from '../provider/ProviderFactory';
import { BaseProvider } from '../provider/BaseProvider';
import { DroneDeliveryProvider } from '../provider/DroneDeliveryProvider';
import { IDeliveryProvider, INeed } from '../types';
import kafka from '../Kafka';

/**
 * NeedController class
 */
class NeedController {
  /**
   * Publish need
   * @param req express Request
   * @param res express Response
   */
  public async publishNeed(req: Request, res: Response) {
    const topicId = req.params.topicId;
    const { davId, location, protocol } = req.body;
    const provider: BaseProvider = providerFactory.getProviderInstance({ protocol });
    // save record in cassandra
    try {
      const need: INeed = {
        davId,
        topicId,
        location,
        protocol,
      };
      let results: IDeliveryProvider[] = [];
      if (provider instanceof DroneDeliveryProvider) {
        results = await provider.query(need);
      }
      if (results.length > 0) {
        const topics: string[] = results.map((result) => {
          return result.topicId;
        });
        kafka.sendMessages(topics, need);
        res.status(200).send({
          message: 'DAV Network Node',
        });
      } else {
        throw new Error('No provider were found matching the request');
      }
    } catch (err) {
      // tslint:disable-next-line:no-console
      console.log(err);
      res.status(404).send({
        message: JSON.stringify(err),
      });
    }
  }
}

export default new NeedController();
