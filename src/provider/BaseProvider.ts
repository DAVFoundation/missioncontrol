import { IProvider } from '../types';

export abstract class BaseProvider {

  protected basicFields: string[] = [
    'dav_id',
    'topic_id',
    'min_lat',
    'min_long',
    'max_lat',
    'max_long',
  ];

  protected protocolSpecificFields: string[] = [];

  protected tableName: string;

  public abstract save(provider: IProvider): Promise<boolean>;
  public abstract query(need: any): any;

  protected getUpsertQuery(): string {
    const fields: string[] = this.basicFields.concat(this.protocolSpecificFields);
    const markers: string[] = new Array<string>(fields.length).fill('?');
    return `INSERT INTO services.${this.tableName} (
      ${fields.join(', ')}
    ) VALUES (
      ${markers.join(', ')}
    ) USING TTL 86400`;
  }

  protected getReadQuery(): string {
    const fields: string[] = this.basicFields.concat(this.protocolSpecificFields);
    return `SELECT ${fields.join(', ')} FROM services.${this.tableName}
                    WHERE area_from_lat > ?
                    AND area_to_lat < ?
                    AND area_from_long > ?
                    AND area_to_long < ?
                    ALLOW FILTERING`;
  }

}
