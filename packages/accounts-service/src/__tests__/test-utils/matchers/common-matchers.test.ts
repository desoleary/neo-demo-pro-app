import { expect } from 'vitest';
import { commonMatchers } from './common-matchers';

expect.extend(commonMatchers);

describe('commonMatchers', () => {
  describe('toBeEmpty', () => {
    it('passes for empty array', () => {
      expect([]).toBeEmpty();
    });

    it('passes for empty object', () => {
      expect({}).toBeEmpty();
    });

    it('fails for non-empty object', () => {
      expect(() => {
        expect({ foo: 'bar' }).toBeEmpty();
      }).toThrowError(/to be empty/);
    });
  });

  describe('toContainKey', () => {
    it('passes when key is present', () => {
      expect({ foo: 'bar' }).toContainKey('foo');
    });

    it('fails when key is absent', () => {
      expect(() => {
        expect({ foo: 'bar' }).toContainKey('baz');
      }).toThrowError(/contain key "baz"/);
    });
  });

  describe('toContainAllKeys', () => {
    it('passes when all keys are present', () => {
      expect({ a: 1, b: 2, c: 3 }).toContainAllKeys(['a', 'b']);
    });

    it('fails when some keys are missing', () => {
      expect(() => {
        expect({ a: 1 }).toContainAllKeys(['a', 'b']);
      }).toThrowError(/contain all keys \[a, b\]/);
    });
  });

  describe('toBeOneOf', () => {
    it('passes when value is in list', () => {
      expect(2).toBeOneOf([1, 2, 3]);
    });

    it('fails when value is not in list', () => {
      expect(() => {
        expect(4).toBeOneOf([1, 2, 3]);
      }).toThrowError(/be one of \[1, 2, 3\]/);
    });
  });

  describe('toBeJsonString', () => {
    it('passes for valid JSON string (object)', () => {
      expect('{"foo":"bar"}').toBeJsonString();
    });

    it('passes for valid JSON string (array)', () => {
      expect('[1,2,3]').toBeJsonString();
    });

    it('fails for invalid JSON string', () => {
      expect(() => {
        expect('{foo:bar}').toBeJsonString();
      }).toThrowError(/be a valid JSON string/);
    });

    it('fails for non-string', () => {
      expect(() => {
        expect(123).toBeJsonString();
      }).toThrowError(/be a valid JSON string/);
    });
  });

  describe('toEqualWithDiff', () => {
    it('passes when objects are equal', () => {
      expect({ foo: 'bar' }).toEqualWithDiff({ foo: 'bar' });
    });

    it('fails when objects are different', () => {
      expect(() => {
        expect({ foo: 'bar' }).toEqualWithDiff({ foo: 'baz' });
      }).toThrowError(/toEqualWithDiff/);
    });
  });
});