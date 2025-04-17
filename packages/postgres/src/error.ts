type KhulnasoftPostgresErrorCode =
  | 'invalid_connection_string'
  | 'missing_connection_string'
  | 'invalid_connection_type'
  | 'incorrect_tagged_template_call';

export class KhulnasoftPostgresError extends Error {
  public constructor(
    public code: KhulnasoftPostgresErrorCode,
    message: string,
  ) {
    super(`KhulnasoftPostgresError - '${code}': ${message}`);
    this.name = 'KhulnasoftPostgresError';
  }
}
