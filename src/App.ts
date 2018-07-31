import * as express from 'express';
import * as bodyParser from 'body-parser';
import NeedController from './controllers/NeedController';
import StatsController from './controllers/StatsController';
import ProviderController from './controllers/ProviderController';

class App {

  public app: express.Application;
  constructor() {
    this.app = express();
    this.config();
  }

  private config(): void {
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: false }));

    const needController = new NeedController();
    const statsController = new StatsController();
    const providerController = new ProviderController();

    this.app.route('/').get(statsController.getInfo);
    this.app.route('/health').get(statsController.getHealthStats);
    this.app.route('/needsForType/:topicId').post(providerController.needsForType);
    this.app.route('/publishNeed/:topicId').post(needController.publishNeed);
  }
}

export default new App().app;
