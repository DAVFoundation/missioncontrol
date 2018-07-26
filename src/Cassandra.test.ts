import cassandra from "./Cassandra";
import * as cassandraDriver from 'cassandra-driver'; 
import { AsyncResource } from "async_hooks";

describe('cassandra', () => {
  it('should connect', async () => {
    expect.assertions(1);
    expect(await cassandra.connect()).toEqual(true);
  });
});