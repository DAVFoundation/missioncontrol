import { Provider } from "../types";

export abstract class BaseProvider {

  protected basicFields: Array<string> = [
    'dav_id',
    'topic_id',
    'min_lat',
    'min_long',
    'max_lat',
    'max_long'
  ];

  protected protocolSpecificFields: Array<string> = [];

  protected tableName: string;

  protected getUpsertQuery(): string {
    let fields: Array<string> = this.basicFields.concat(this.protocolSpecificFields);
    let markers: Array<string> = new Array<string>(fields.length).fill('?');
    return `INSERT INTO services.${this.tableName} (
      ${fields.join(', ')}
    ) VALUES (
      ${markers.join(', ')}
    ) USING TTL 86400`;
  }

  protected getReadQuery(): string {
    let fields: Array<string> = this.basicFields.concat(this.protocolSpecificFields);
    return `SELECT ${fields.join(', ')} FROM services.${this.tableName} 
                    WHERE area_from_lat > ? 
                    AND area_to_lat < ? 
                    AND area_from_long > ?
                    AND area_to_long < ?
                    ALLOW FILTERING`;
  }

  abstract save(provider: Provider): Promise<boolean>;
  abstract query(need: any): any;
}