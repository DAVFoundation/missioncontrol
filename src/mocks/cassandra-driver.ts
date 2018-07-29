// tslint:disable:max-classes-per-file
export class Client {
  public connect() {
    return Promise.resolve(true);
  }
  public execute(query: string, params: any[], options: any) {
    return Promise.resolve(new ResultSet());
  }
}

export class FailingToConnectClient extends Client {
  public connect() {
    return Promise.reject(false);
  }
}

export class ResultSet {
  public first() {
    return {
      dav_id: '123',
      topic_id: '321',
      min_lat: 1,
      min_long: 1,
      max_lat: 1,
      max_long: 1,
      max_length: 1,
      max_width: 1,
      max_height: 1,
    };
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
