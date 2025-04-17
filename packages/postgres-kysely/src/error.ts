type KhulnasoftPostgresKyselyErrorCode =
  | 'kysely_transactions_not_supported'
  | 'kysely_streaming_not_supported';

export class KhulnasoftPostgresKyselyError extends Error {
  public constructor(
    public code: KhulnasoftPostgresKyselyErrorCode,
    message: string,
  ) {
    super(`KhulnasoftPostgresError - '${code}': ${message}`);
    this.name = 'KhulnasoftPostgresError';
  }
}
