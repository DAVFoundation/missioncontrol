import { Client, types, metadata } from 'cassandra-driver';
import { ICassandraStatus } from './types';

export default class Cassandra {

  private static _instance: Cassandra = null;

  private connected: boolean = false;

  private options = {
    contactPoints: ['cassandra'],
    keyspace: 'services',
    pooling: {
      coreConnectionsPerHost: {
        [types.distance.local]: 2,
        [types.distance.remote]: 1,
      },
    },
  };
  private client: Client;

  public static async getInstance(): Promise<Cassandra> {

    if (Cassandra._instance === null) {
      Cassandra._instance = new Cassandra();
      await Cassandra._instance.connect();
    }
    return Cassandra._instance;
  }

  private constructor() {
    this.client = new Client(this.options);
  }

  public isConnected() {
    return this.connected;
  }

  public async connect(): Promise<boolean> {
    try {
      await this.client.connect();
      this.connected = true;
    } catch (err) {
      throw Error('Cassandra connection error: ' + JSON.stringify(err));
    }
    return this.connected;
  }

  public getStatus(): ICassandraStatus {
    const status: ICassandraStatus = {
      connected: this.connected,
    };
    if (this.connected) {
      const state: metadata.ClientState = this.client.getState();
      status.hosts = state.getConnectedHosts().map((host) => {
        return {
          address: host.address,
          connections: state.getOpenConnections(host),
          queries: state.getInFlightQueries(host),
        };
      });
    }
    return status;
  }

  public async save(query: string, params: any[]) {
    // save record in cassandra
    try {
      await this.client.execute(query, params, { prepare: true });
      return true;
    } catch (err) {
      throw Error('Cassandra failed to save record: ' + JSON.stringify(err));
    }
  }

  public async query(query: string, params: any[]): Promise<types.ResultSet> {
    // save record in cassandra
    try {
      const result = await this.client.execute(query, params, { prepare: true });
      return result;
    } catch (err) {
      throw Error('Cassandra query failed: ' + JSON.stringify(err));
    }
  }

}
