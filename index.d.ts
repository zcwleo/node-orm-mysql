import {
  OkPacket,
  Connection,
  QueryOptions,
  RowDataPacket,
  ConnectionOptions
} from 'mysql2';

type Clients = {
  [key: string]: Connection
}

type ConditionValueType = null | string | number | boolean | Date | Array<string | number | boolean | Date>;

type OptType = '=' | '!=' | '>' | '<' | '>=' | '<=' | 'LIKE'
  | 'NOT LIKE' | 'IN' | 'NOT IN' | 'BETWEEN' | 'NOT BETWEEN' | 'IS' | 'IS NOT' | 'REGEXP' | 'NOT REGEXP'
  | 'AND' | 'OR' | 'GROUP' | 'like' | 'not like' | 'in' | 'not in' | 'between' | 'not between' | 'is' | 'is not' | 'regexp' | 'not regexp' | 'group';

interface WhereOptions {
  key: string | null;
  opt: OptType;
  value: ConditionValueType | WhereOptions[];
}

interface OrderByOptions {
  sortField: string,
  sortOrder: 'asc' | 'desc'
}

type OperatorType = 'select' | 'find' | 'insert' | 'update' | 'delete' | 'count';

interface JoinOption {
  table: string;
  alias: string;
  on: string;
  type: 'left' | 'right' | 'inner';
}

interface TableOption {
  tableName: string;
  alias: string | null;
}

interface QueryOperatorOptions {
  sql: string;
  values: any[];
  conditions: WhereOptions[];
  attrs?: string[] | null;
  orders: OrderByOptions[];
  pageLimit?: number;
  pageOffset?: number;
  tables: TableOption[];
  operator: OperatorType | null;
  data: any | null;
  groupField: string[];
  joins: JoinOption[]
}

export declare class QueryOperator {
  conn: Connection;
  options: QueryOperatorOptions

  constructor(conn: Connection, table: TableOption);

  table(tableName: string, alias: string | null): this;

  limit(limit: number): this;

  offset(offset: number): this;

  where(key: string | null, value: ConditionValueType | WhereOptions[], opt?: OptType): this;

  whereConditions(...condition: WhereOptions[]): this;

  orWhere(key: string | null, opt: OptType, value: ConditionValueType | WhereOptions[]): this;

  andWhere(key: string | null, opt: OptType, value: ConditionValueType | WhereOptions[]): this;

  attr(...attr: string[]): this;

  orderBy(sortField: string, sortOrder: 'asc' | 'desc'): this;

  groupBy(...groupField: string[]): this;

  page(limit: number, offset?: number): this;

  set(data: any): this;

  join(table: string, alias: string, on: string, type: 'left' | 'right' | 'inner'): this;

  buildSql(operator: OperatorType): { sql: string, values: any[] };

  exec(): Promise<any | undefined | RowDataPacket[] | RowDataPacket | OkPacket>;

  select<T>(): Promise<T[]>;

  find<T>(): Promise<T>;

  update(data?: any): Promise<OkPacket>;

  insert(data?: any): Promise<OkPacket>;

  count(): Promise<number>;
}

export declare class QueryHandler {
  conn: Connection;

  constructor(conn: Connection);

  table(table: string, alias?: string | null): QueryOperator;

  query(options: QueryOptions): Promise<any>;

  upsert(tableName: string, obj: any, condition: WhereOptions[]): Promise<OkPacket>;
}

export function createClient(options: ConnectionOptions): Connection;

export function getClient(name: string): Connection;
