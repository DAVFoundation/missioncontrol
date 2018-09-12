import { KafkaClient } from 'kafka-node';

export type ID = string;
export type DavID = string;
export type BigInteger = string;

export interface IProtocolOptions {
  // TODO: This should be an enum with string values
  protocol: string;
}

export interface ILocation {
  latitude: number;
  longitude: number;
}

export interface IArea {
  min: ILocation;
  max: ILocation;
}

export interface IDimensions {
  length: number;
  width: number;
  height: number;
  weight: number;
}

export interface IProvider {
  topicId: string;
  area: IArea;
  protocol: string;
}

export interface IBoatChargingProvider extends IProvider {
  dimensions?: IDimensions;
}

export interface IDeliveryProvider extends IProvider {
  dimensions?: IDimensions;
}

export interface INeed {
  topicId: string;
  protocol: string;
  data: any;
}

export interface ICassandraHost {
  address: string;
  connections: number;
  queries: number;
}

export interface IServiceStatus {
  connected: boolean;
  error?: Error | string;
}

export interface ICassandraStatus extends IServiceStatus {
  hosts?: ICassandraHost[];
}
