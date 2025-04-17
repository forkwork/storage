import type {
  DatabaseConnection,
  Dialect,
  DialectAdapter,
  Driver,
  KyselyConfig,
} from 'kysely';
import {
  PostgresDialect,
  PostgresDriver,
  Kysely,
  PostgresAdapter,
} from 'kysely';
import type { Pool } from '@neondatabase/serverless';
import { createPool } from '@khulnasoft/postgres';
import type { KhulnasoftPostgresPoolConfig } from '@khulnasoft/postgres';
import { KhulnasoftPostgresKyselyError } from './error';

type KhulnasoftPostgresDialectConfig = KhulnasoftPostgresPoolConfig & {
  pool: Pool;
};

class KhulnasoftPostgresAdapter extends PostgresAdapter {
  // represented as readonly property to satisfy eslint rule:
  // typescript-eslint/class-literal-property-style
  private readonly _supportsTransactionalDdl = false;
  public get supportsTransactionalDdl(): boolean {
    return this._supportsTransactionalDdl;
  }
}

class KhulnasoftPostgresDialect extends PostgresDialect implements Dialect {
  constructor(private config: KhulnasoftPostgresDialectConfig) {
    super(config);
  }

  createAdapter(): DialectAdapter {
    return new KhulnasoftPostgresAdapter();
  }

  createDriver(): Driver {
    return new KhulnasoftPostgresPoolDriver(this.config);
  }
}

class KhulnasoftPostgresPoolDriver extends PostgresDriver {
  // Rather than trying to rebuild a perfectly good connection pool,
  // we can just use a proxy to throw if the user tries to stream.
  async acquireConnection(): Promise<DatabaseConnection> {
    const connection = await super.acquireConnection();
    return new Proxy(connection, {
      get(target, p) {
        const original = target[p as keyof DatabaseConnection];
        if (p === 'streamQuery' && typeof original === 'function') {
          throw new KhulnasoftPostgresKyselyError(
            'kysely_streaming_not_supported',
            'Streaming is not supported yet.',
          );
        }
        if (typeof original === 'function') {
          return original.bind(target);
        }
        return original;
      },
    });
  }

  beginTransaction(): Promise<void> {
    throw new KhulnasoftPostgresKyselyError(
      'kysely_transactions_not_supported',
      'Transactions are not supported yet.',
    );
  }

  commitTransaction(): Promise<void> {
    throw new KhulnasoftPostgresKyselyError(
      'kysely_transactions_not_supported',
      'Transactions are not supported yet.',
    );
  }

  rollbackTransaction(): Promise<void> {
    throw new KhulnasoftPostgresKyselyError(
      'kysely_transactions_not_supported',
      'Transactions are not supported yet.',
    );
  }
}

export function createKysely<T>(
  poolConfig?: KhulnasoftPostgresPoolConfig,
  kyselyConfig?: Partial<KyselyConfig>,
): Kysely<T> {
  return new Kysely<T>({
    ...kyselyConfig,
    dialect: new KhulnasoftPostgresDialect({
      ...poolConfig,
      pool: createPool(poolConfig),
    }),
  });
}
