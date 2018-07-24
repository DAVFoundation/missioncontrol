import { Request, Response} from 'express';
import kafka from '../Kafka';
import cassandra from '../Cassandra';

class StatsController {

  public getInfo(req: Request, res: Response) {
    res.status(200).send({
      message: 'DAV Network Node'
    });
  }

  public async getHealthStats(req: Request, res: Response) {
    let cassandraStatus:any = cassandra.getStatus();
    let kafkaStatus:any = kafka.getStatus();
    
    let stats = {
      app: {
        connected: false
      },
      kafka: kafkaStatus,
      cassandra: cassandraStatus
    }
    res.status(200).send({
      message: stats
    });
  }
}

export default new StatsController();