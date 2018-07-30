import { Client, types, metadata } from 'cassandra-driver';
import { IProvider } from './types';

export class Cassandra {


  // TODO: should be an instance field
  private static _isConnected: boolean = false;
  // TODO: should be an instance field
  private static _instance: Cassandra;

  // TODO: should be an instance field
  private static options = {
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

  // TODO: should be an instance method
  public static isConnected() {
    return Cassandra._isConnected;
  }

  public static async getInstance(): Promise<Cassandra> {

    if (Cassandra._isConnected  === false) {
      this._instance = new Cassandra();
      Cassandra._isConnected = await Cassandra._instance.connect();
    }
    return Cassandra._instance;
  }

  private constructor() {
    this.client = new Client(Cassandra.options);
  }

  public async connect(): Promise<boolean> {
    try {
      await this.client.connect();
      return true;
    } catch (err) {
      // TODO: instead of logging - throw the exception out - let someone who can handle this do it.
      console.error('Cassandra connection error: ', err);
      return false;
    }
  }

  // TODO: Define an interface CassandraStatus to use as return type
  public getStatus(): any {
    const status: any = {
      connected: Cassandra._isConnected,
    };
    if (Cassandra._isConnected) {
      const hosts = [];
      const state: metadata.ClientState = this.client.getState();
      // TODO: use Array.map
      for (const host of state.getConnectedHosts()) {
        hosts.push({
          address: host.address,
          connections: state.getOpenConnections(host),
          queries: state.getInFlightQueries(host),
        });
      }
      status.hosts = hosts;
    }
    return status;
  }

  public async save(query: string, params: any[]) {
    // save record in cassandra
    try {
      // TODO: remove result - it is not used
      const result = await this.client.execute(query, params, { prepare: true });
      return true;
    } catch (err) {
      // TODO: instead of logging - throw the exception out - let someone who can handle this do it.
      // tslint:disable-next-line:no-console
      console.log(err);
      return false;
    }
  }

  public async query(query: string, params: any[]): Promise<types.ResultSet> {
    // save record in cassandra
    try {
      const result = await this.client.execute(query, params, { prepare: true });
      return result;
    } catch (err) {
      // TODO: instead of logging - throw the exception out - let someone who can handle this do it.
      // tslint:disable-next-line:no-console
      console.log(err);
      return null;
    }
  }

}
