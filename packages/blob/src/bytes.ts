/*!
 * bytes
 * Copyright(c) 2012-2014 TJ Holowaychuk
 * Copyright(c) 2015 Jed Watson
 * MIT Licensed
 */

// from https://github.com/visionmedia/bytes.js/blob/master/index.js
// had too many issues with bundling: https://github.com/khulnasoft/storage/issues/818
type ByteUnit = 'b' | 'kb' | 'mb' | 'gb' | 'tb' | 'pb';

type ByteUnitMap = {
  readonly [_K in ByteUnit]: number;
};

// eslint-disable-next-line prefer-named-capture-group -- fine
const parseRegExp = /^((-|\+)?(\d+(?:\.\d+)?)) *(kb|mb|gb|tb|pb)$/i;

const map: ByteUnitMap = {
  b: 1,
  // eslint-disable-next-line no-bitwise -- fine
  kb: 1 << 10,
  // eslint-disable-next-line no-bitwise -- fine
  mb: 1 << 20,
  // eslint-disable-next-line no-bitwise -- fine
  gb: 1 << 30,
  tb: Math.pow(1024, 4),
  pb: Math.pow(1024, 5),
};

export function bytes(val: string | number): number | null {
  if (typeof val === 'number' && !isNaN(val)) {
    return val;
  }
  if (typeof val !== 'string') {
    return null;
  }

  const results = parseRegExp.exec(val);
  let floatValue: number;
  let unit: ByteUnit = 'b';

  if (!results) {
    floatValue = parseInt(val, 10);
  } else {
    const [, res, , , unitMatch] = results;
    if (!res) {
      return null;
    }
    floatValue = parseFloat(res);
    if (unitMatch) {
      unit = unitMatch.toLowerCase() as ByteUnit;
    }
  }

  if (isNaN(floatValue)) {
    return null;
  }

  return Math.floor(map[unit] * floatValue);
}
