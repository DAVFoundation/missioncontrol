import { KafkaClient } from 'kafka-node';

export interface Location {
  latitude: number
  longitude: number
}

export interface Area {
  from: Location
  to: Location
}

export class Provider {
  id: string;
  area: Area;
  serviceType: string;
  constructor(id: string, area: Area, serviceType: string) {
    this.id = id;
    this.area = area;
    this.serviceType = serviceType;
  }
}