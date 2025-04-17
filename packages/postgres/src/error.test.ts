import { KhulnasoftPostgresError } from './error';

describe('khulnasoftPostgresError', () => {
  const name = 'KhulnasoftPostgresError';
  const msg = 'this is a message';
  const code = 'invalid_connection_string';
  const err = new KhulnasoftPostgresError(code, msg);

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
