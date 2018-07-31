import { Request, Response} from 'express';
import kafka from '../Kafka';
import cassandra from '../Cassandra';
import { ICassandraStatus } from '../types';

class StatsController {

  public getInfo(req: Request, res: Response) {
    res.status(200).send({
      message: 'DAV Network Node',
    });
  }

  public async getHealthStats(req: Request, res: Response) {
    const cassandraStatus: ICassandraStatus = (await cassandra.getInstance()).getStatus();
    // TODO: Should use await
    const kafkaStatus: any = kafka.getStatus();

    const stats = {
      app: {
        connected: false,
      },
      kafka: kafkaStatus,
      cassandra: cassandraStatus,
    };
    res.status(200).send({
      message: stats,
    });
  }
}

// TODO: export the class not the instance
export default new StatsController();
