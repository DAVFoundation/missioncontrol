import { Request, Response} from 'express';
import kafka from '../Kafka';
import cassandra from '../Cassandra';
import { ICassandraStatus, IServiceStatus } from '../types';

export default class StatsController {

  public getInfo(req: Request, res: Response) {
    res.status(200).send({
      message: 'DAV Network Node',
    });
  }

  public async getHealthStats(req: Request, res: Response) {
    const cassandraStatus: ICassandraStatus = (await cassandra.getInstance()).getStatus();
    const kafkaStatus: IServiceStatus = await kafka.getInstance().getStatus();

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

