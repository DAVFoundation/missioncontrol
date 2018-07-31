// tslint:disable:max-classes-per-file
export class Client {
  public connect() {
    return Promise.resolve(true);
  }
  public execute(query: string, params: any[], options: any) {
    return Promise.resolve(new ResultSet());
  }
  public getState() {
    return new ClientState();
  }
}

export interface IHost {
  address: string;
}

export class ClientState {
  public getConnectedHosts(): IHost[] {
    return [{
      address: 'localhost',
    }];
  }
  public getInFlightQueries(host: IHost): number {
    return 1;
  }
  public getOpenConnections(host: IHost): number {
    return 0;
  }
}

export class FailingToConnectClient extends Client {
  public connect() {
    return Promise.reject(false);
  }
}

export class ResultSet {
  private index = 0;
  private values = [
    {
      dav_id: '123',
      topic_id: '321',
      min_lat: 1,
      min_long: 1,
      max_lat: 1,
      max_long: 1,
      max_length: 1,
      max_width: 1,
      max_height: 1,
    },
  ];
  public [Symbol.iterator]() {
    return {
      next: () => {
        if (this.index < this.values.length) {
          return {value: this.values[this.index++], done: false};
        } else {
          this.index = 0; // If we would like to iterate over this again without forcing manual update of the index
          return {done: true};
        }
      },
    };
   }

  public first() {
    return this.values[0];
  }
}

export const types = {
  distance: {
    local: {},
    remote: {},
  },
  ResultSet,
  Row: { },
};

export const cassandraDriver = () => {
  return {
    Client,
    types,
  };
};

export const cassandraFailingToConnectDriver = () => {
  return {
    Client: FailingToConnectClient,
    types,
  };
};
