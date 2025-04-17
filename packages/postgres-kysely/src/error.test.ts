import { KhulnasoftPostgresKyselyError } from './error';

describe('khulnasoftPostgresError', () => {
  const name = 'KhulnasoftPostgresError';
  const msg = 'this is a message';
  const code = 'kysely_transactions_not_supported';
  const err = new KhulnasoftPostgresKyselyError(code, msg);

  it('correctly formats message', () => {
    expect(err.message).toEqual(`${name} - '${code}': ${msg}`);
  });
  it('set name', () => {
    expect(err.name).toEqual(name);
  });
  it('sets code', () => {
    expect(err.code).toEqual(code);
  });
});
