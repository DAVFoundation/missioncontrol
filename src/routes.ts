import { Request, Response, Application } from 'express';

export class Routes {

  public routes(app: Application): void {

    app.route('/')
      .get((req: Request, res: Response) => {
        res.status(200).send({
          message: 'DAV Network Node'
        })
      })
      app.route('/health')
      .get((req: Request, res: Response) => {
        res.status(200).send({
          message: 'DAV Network Node health Request'
        })
      })
      app.route('/needsForType/:topicId')
      .post((req: Request, res: Response) => {
        res.status(200).send({
          message: 'DAV Network Node needsForType Request'
        })
      })
      app.route('/publishNeed/:topicId')
      .post((req: Request, res: Response) => {
        res.status(200).send({
          message: 'DAV Network Node publishNeed Request'
        })
      })
  }
}
