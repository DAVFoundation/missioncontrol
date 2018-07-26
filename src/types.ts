import { KafkaClient } from 'kafka-node';

export type ID = string;
export type DavID = string;
export type BigInteger = string;

export interface ProtocolOptions {
  protocol: 'drone_delivery' | 'drone_charging'
}

export interface Location {
  latitude: number
  longitude: number
}

export interface Area {
  min: Location
  max: Location
}

export interface Dimensions {
  length: number
  width: number
  height: number
}

export interface Provider {
  davId: DavID
  topicId: string
  area: Area
  protocol: string
}

export interface DeliveryProvider extends Provider {
  dimensions: Dimensions
}