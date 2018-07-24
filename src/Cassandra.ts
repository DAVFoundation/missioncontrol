import { Client, types, metadata } from 'cassandra-driver';
import { Provider } from './Provider';

class Cassandra {
  private tableName = 'provider';
  private insertQuery = `INSERT INTO services.${this.tableName} (
    provider_id, 
    serviceType, 
    area_from_lat,
    area_from_long,
    area_to_lat,
    area_to_long
  ) VALUES (?, ?, ?, ?, ?, ?) USING TTL 86400;`;

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

  public async saveProvider(provider: Provider): Promise<boolean> {
    //create cassandra record
    try {
      let result = await this.client.execute(this.insertQuery, [
        provider.id.toString(),
        provider.serviceType,
        provider.area.from.latitude,
        provider.area.from.longitude,
        provider.area.to.latitude,
        provider.area.to.longitude,
      ], { prepare: true });
      console.log('info', `saved provider with id ${provider.id}`, { message: result });
      return true;
    } catch(err) {
      console.log(err);
      return false;
    }
  }

}

export default new Cassandra();