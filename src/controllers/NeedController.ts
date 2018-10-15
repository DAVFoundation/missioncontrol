import Kafka from '../Kafka';
import { Request, Response } from 'express';
import ProviderFactory from '../provider/ProviderFactory';
import { BaseProvider } from '../provider/BaseProvider';
import { INeed, IProvider } from '../types';

// TODO: Need to add tests for this module

/**
 * NeedController class
 */
export default class NeedController {
  private static async sendNeed(topics: string[], need: any): Promise<void> {
    const payloads = topics.map(topic => ({
      topic,
      messages: JSON.stringify(need),
    }));
    return Kafka.sendPayloads(payloads);
  }

  /**
   * Publish need
   * @param req express Request
   * @param res express Response
   */
  public async publishNeed(req: Request, res: Response) {
    const topicId = req.params.topicId;
    const { location, protocol } = req.body;
    const providerFactory = new ProviderFactory();
    const provider: BaseProvider = providerFactory.getProviderInstance({
      protocol,
    });
    // save record in cassandra
    try {
      const need: INeed = {
        topicId,
        protocol,
        data: req.body,
      };

      const results: IProvider[] = await provider.query(need);
      if (results.length > 0) {
        const topics: string[] = results.map(result => {
          return result.topicId;
        });
        const originalNeed: any = req.body;
        await NeedController.sendNeed(topics, originalNeed);
        res.status(200).send({
          message: 'Need was published',
        });
      } else {
        res.status(404).send({
          error: 'No providers were found matching the request',
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
