import Kafka from '../Kafka';
import { Request, Response} from 'express';

export default class KafkaRequestsController {
    public async createTopic(req: Request, res: Response) {
        try {
            await Kafka.getInstance().createTopic(req.params.topicId);
            res.status(200).send({
                message: 'Topic was created',
            });
        } catch (err) {
            // tslint:disable-next-line:no-console
            console.log(err);
            res.status(500).send({
                error: `An error ocurred ${ err.message || JSON.stringify(err) }`,
            });
        }
    }

    public async sendMessage(req: Request, res: Response) {
        try {
            await Kafka.getInstance().sendMessage(req.params.topicId, req.body);
            res.status(200).send({
                message: 'Message was sent',
            });
        } catch (err) {
            // tslint:disable-next-line:no-console
            console.log(err);
            res.status(500).send({
                error: `An error ocurred ${ err.message || JSON.stringify(err) }`,
            });
        }
    }

    public async getMessages(req: Request, res: Response) {
        try {
            const messages = await Kafka.getInstance().getMessages(req.params.topicId, req.query.timeout);
            res.status(200).send(messages);
        } catch (err) {
            // tslint:disable-next-line:no-console
            console.log(err);
            res.status(500).send({
                error: `An error ocurred ${ err.message || JSON.stringify(err) }`,
            });
        }
    }
}
