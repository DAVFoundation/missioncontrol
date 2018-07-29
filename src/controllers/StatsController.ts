import { Request, Response} from 'express';
import kafka from '../Kafka';
import { Cassandra } from '../Cassandra';

class StatsController {

  public getInfo(req: Request, res: Response) {
    res.status(200).send({
      message: 'DAV Network Node',
    });
  }

  public async getHealthStats(req: Request, res: Response) {
    const cassandra: Cassandra = await Cassandra.getInstance();
    const cassandraStatus: any = cassandra.getStatus();
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

export default new StatsController();
