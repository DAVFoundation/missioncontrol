import { Request, Response } from 'express';
import Kafka from '../Kafka';
import { timeout, map } from 'rxjs/operators';
import { Message } from 'kafka-node';

export default class KafkaRequestsController {
  public async createTopic(req: Request, res: Response) {
    try {
      await Kafka.createTopic(req.params.topicId);
      res.status(200).send({
        message: 'Topic was created',
      });
    } catch (err) {
      // tslint:disable-next-line:no-console
      console.log(err);
      res.status(500).send({
        error: `An error occurred ${err.message || JSON.stringify(err)}`,
      });
    }
  }

  public async sendMessage(req: Request, res: Response) {
    try {
      await Kafka.sendMessage(req.params.topicId, JSON.stringify(req.body));
      res.status(200).send({
        message: 'Message was sent',
      });
    } catch (err) {
      // tslint:disable-next-line:no-console
      console.log(err);
      res.status(500).send({
        error: `An error occurred ${err.message || JSON.stringify(err)}`,
      });
    }
  }

  public async getMessages(req: Request, res: Response) {
    try {
      const messages = await (await Kafka.rawMessages(req.params.topicId))
        .pipe(timeout(req.query.timeout))
        .pipe(map((message: any) => message.value))
        .toArray()
        .toPromise();
      res.status(200).send(JSON.stringify(messages));
    } catch (err) {
      // tslint:disable-next-line:no-console
      console.log(err);
      res.status(500).send({
        error: `An error occurred ${err.message || JSON.stringify(err)}`,
      });
    }
  }
}
