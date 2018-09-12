import { IProvider } from '../types';

export abstract class BaseProvider {

  protected basicFields: string[] = [
    'topic_id',
    'min_lat',
    'min_long',
    'max_lat',
    'max_long',
  ];

  protected protocolSpecificFields: string[] = [];

  protected tableName: string;

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
                    WHERE min_lat < ?
                    AND min_long < ?
                    AND max_lat > ?
                    AND max_long > ?
                    ALLOW FILTERING`;
  }

  public abstract save(provider: IProvider): Promise<boolean>;
  public abstract query(need: any): any;

}
