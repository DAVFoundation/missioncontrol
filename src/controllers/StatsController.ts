import { Request, Response } from 'express';
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
    let cassandraStatus: ICassandraStatus = {
      connected: false,
    };
    try {
      cassandraStatus = (await cassandra.getInstance()).getStatus();
    } catch (error) {
      cassandraStatus.error = error.message;
    }

    let kafkaStatus: IServiceStatus;
    try {
      kafkaStatus = await kafka.getInstance().getStatus();
    } catch (error) {
      kafkaStatus.error = error.message;
    }

    const stats = {
      app: {
        connected: true,
      },
      kafka: kafkaStatus,
      cassandra: cassandraStatus,
    };
    res.status(200).send({
      message: stats,
    });
  }
}

