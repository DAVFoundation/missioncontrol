import { Request, Response} from 'express';
import { Provider } from '../types';
import cassandra from '../Cassandra';
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
    let topicId = req.params.topicId;
    let { davId, area, protocol, dimensions } = req.body;

    let provider: BaseProvider = providerFactory.getProviderInstance({ protocol });
    //save record in cassandra
    try {
      let result: boolean = false;
      if(provider instanceof DroneDeliveryProvider) {
        result = await provider.save({
          davId,
          topicId,
          protocol,
          area,
          dimensions
        });
      }
      if(result === true) {
        res.status(200).send({
          message: 'DAV Network Node'
        });
      } else {
        throw new Error('Error saving provider')
      }
    } catch (err) {
      console.log(err);
      res.status(200).send({
        message: JSON.stringify(err)
      });
    }
  }
}

export default new ProviderController();