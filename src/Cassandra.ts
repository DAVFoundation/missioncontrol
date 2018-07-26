import { Client, types, metadata } from 'cassandra-driver';
import { Provider } from './types';

class Cassandra {
  private tableName = 'provider';

  private options = {
    contactPoints: ['cassandra'],
    keyspace: 'services',
    pooling: {
      coreConnectionsPerHost: {
        [types.distance.local]: 2,
        [types.distance.remote]: 1
      }
    }
  };

  private client: Client;
  private isConnected: boolean;

  constructor() {
    this.client = new Client(this.options);
    this.client.connect((err: Error) => {
      if (err) {
        this.isConnected = false;
        console.error('Cassandra connection error: ', err);
      } else {
        this.isConnected = true;
      }
    });
  }

  public async connect(): Promise<boolean> {
    try {
      await this.client.connect()
      return true;
    } catch (err) {
      console.error('Cassandra connection error: ', err);
      return false;
    }
  }

  public getStatus(): any {
    let status: any = {
      connected: this.isConnected
    };
    if (this.isConnected) {
      let hosts = [];
      let state: metadata.ClientState = this.client.getState();
      for (let host of state.getConnectedHosts()) {
        hosts.push({
          address: host.address,
          connections: state.getOpenConnections(host),
          queries: state.getInFlightQueries(host)
        });
      }
      status['hosts'] = hosts;
    }
    console.log(status);
    return status;
  }

  public async save(query: string, params: Array<any>) {
    //save record in cassandra
    try {
      let result = await this.client.execute(query, params, { prepare: true });
      console.log('info', `query saved`);
      return true;
    } catch (err) {
      console.log(err);
      return false;
    }
  }

  public async query(query: string, params: Array<any>) : Promise<types.ResultSet> {
    //save record in cassandra
    try {
      let result = await this.client.execute(query, params, { prepare: true });
      return result;
    } catch (err) {
      console.log(err);
      return null;
    }
  }

}

export default new Cassandra();