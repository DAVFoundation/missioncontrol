import { Request, Response} from 'express';
import { Provider } from '../Provider';
import cassandra from '../Cassandra';

/**
 * ProviderController class
 */
class ProviderController {
  /**
   * Register provider for a need type. 
   * @param req express Request
   * @param res express Response
   */
  public needsForType(req: Request, res: Response) {
    let id = req.params.topicId;
    let { area, serviceType } = req.body;
    let provider = new Provider(id, area, serviceType);
    cassandra.saveProvider(provider);
    res.status(200).send({
      message: 'DAV Network Node'
    });
  }
}

export default new ProviderController();