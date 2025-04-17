import type {
  PoolClient,
  QueryResult,
  QueryResultRow,
} from '@neondatabase/serverless';
import { Pool, neon } from '@neondatabase/serverless';
import type {
  KhulnasoftPoolClient,
  KhulnasoftPostgresPoolConfig,
} from './types';
import {
  isLocalhostConnectionString,
  isPooledConnectionString,
  postgresConnectionString,
} from './postgres-connection-string';
import { KhulnasoftPostgresError } from './error';
import type { Primitive } from './sql-template';
import { sqlTemplate } from './sql-template';
import { KhulnasoftClient } from './create-client';

export class KhulnasoftPool extends Pool {
  Client = KhulnasoftClient;
  private connectionString: string;

  constructor(config: KhulnasoftPostgresPoolConfig) {
    super(config);
    this.connectionString = config.connectionString ?? '';
  }

  /**
   * A template literal tag providing safe, easy to use SQL parameterization.
   * Parameters are substituted using the underlying Postgres database, and so must follow
   * the rules of Postgres parameterization.
   * @example
   * ```ts
   * const pool = createPool();
   * const userId = 123;
   * const result = await pool.sql`SELECT * FROM users WHERE id = ${userId}`;
   * // Equivalent to: await pool.query('SELECT * FROM users WHERE id = $1', [id]);
   * ```
   * @returns A promise that resolves to the query result.
   */
  async sql<O extends QueryResultRow>(
    strings: TemplateStringsArray,
    ...values: Primitive[]
  ): Promise<QueryResult<O>> {
    const [query, params] = sqlTemplate(strings, ...values);

    const sql = neon(this.connectionString, {
      fullResults: true,
    });
    return sql(query, params) as unknown as Promise<QueryResult<O>>;
  }

  connect(): Promise<KhulnasoftPoolClient>;
  connect(
    callback: (
      err: Error,
      client: KhulnasoftPoolClient,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- [@khulnasoft/style-guide@5 migration]
      done: (release?: any) => void,
    ) => void,
  ): void;
  connect(
    callback?: (
      err: Error,
      client: KhulnasoftPoolClient,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- [@khulnasoft/style-guide@5 migration]
      done: (release?: any) => void,
    ) => void,
    // eslint-disable-next-line @typescript-eslint/no-invalid-void-type -- [@khulnasoft/style-guide@5 migration]
  ): void | Promise<KhulnasoftPoolClient> {
    // eslint-disable-next-line @typescript-eslint/no-confusing-void-expression -- [@khulnasoft/style-guide@5 migration]
    return super.connect(
      callback as (
        err: Error,
        client: PoolClient,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any -- [@khulnasoft/style-guide@5 migration]
        done: (release?: any) => void,
      ) => void,
    );
  }
}

export function createPool(
  config?: KhulnasoftPostgresPoolConfig,
): KhulnasoftPool {
  const connectionString =
    config?.connectionString ?? postgresConnectionString('pool');
  if (!connectionString)
    throw new KhulnasoftPostgresError(
      'missing_connection_string',
      "You did not supply a 'connectionString' and no 'POSTGRES_URL' env var was found.",
    );

  if (
    !isLocalhostConnectionString(connectionString) &&
    !isPooledConnectionString(connectionString)
  )
    throw new KhulnasoftPostgresError(
      'invalid_connection_string',
      'This connection string is meant to be used with a direct connection. Make sure to use a pooled connection string or try `createClient()` instead.',
    );

  let maxUses = config?.maxUses;
  let max = config?.max;
  if (typeof EdgeRuntime !== 'undefined') {
    if (maxUses && maxUses !== 1) {
      // eslint-disable-next-line no-console -- [@khulnasoft/style-guide@5 migration]
      console.warn(
        '@khulnasoft/postgres: Overriding `maxUses` to 1 because the EdgeRuntime does not support client reuse.',
      );
    }
    if (max && max !== 10_000) {
      // eslint-disable-next-line no-console -- [@khulnasoft/style-guide@5 migration]
      console.warn(
        '@khulnasoft/postgres: Overriding `max` to 10,000 because the EdgeRuntime does not support client reuse.',
      );
    }
    // Client reuse is not supported in the EdgeRuntime because it does not support IO across requests.
    maxUses = 1;
    // Since we do not allow client reuse, we need a higher max number of clients to avoid running out of
    // connections.
    // Usecase: a website that needs more than 10 concurrent connections
    // https://node-postgres.com/apis/pool#new-pool
    max = 10_000;
  }

  const pool = new KhulnasoftPool({
    ...config,
    connectionString,
    maxUses,
    max,
  });
  return pool;
}
