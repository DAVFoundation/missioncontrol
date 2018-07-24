import { Request, Response} from 'express';

/**
 * NeedController class
 */
class NeedController {
  /**
   * Publish need 
   * @param req express Request
   * @param res express Response
   */
  public publishNeed(req: Request, res: Response) {
    res.status(200).send({
      message: 'DAV Network Node'
    });
  }
}

export default new NeedController();