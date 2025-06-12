import GraphqlResponseWrapper from '@test-utils/GraphqlResponseWrapper';
import colours from '@test-utils/colours';

describe('GraphqlResponseWrapper', () => {
  describe('data', () => {
    it('returns single root data field', () => {
      const wrapper = new GraphqlResponseWrapper({
        data: { foo: { value: 42 } },
      });

      expect(wrapper.data).toEqual({ value: 42 });
    });

    it('throws error if multiple root fields', () => {
      const wrapper = new GraphqlResponseWrapper({
        data: { foo: {}, bar: {} },
      });

      expect(() => wrapper.data).toThrowError(
        'Expected single root field in data, found: foo, bar'
      );
    });

    it('throws error if no data', () => {
      const wrapper = new GraphqlResponseWrapper({});
      expect(() => wrapper.data).toThrowError('Expected single root field in data');
    });
  });

  describe('dataRaw', () => {
    it('returns raw data', () => {
      const wrapper = new GraphqlResponseWrapper({
        data: { foo: { value: 123 } },
      });
      expect(wrapper.dataRaw).toEqual({ foo: { value: 123 } });
    });
  });

  describe('mutationName', () => {
    it('returns mutation name if data has key', () => {
      const wrapper = new GraphqlResponseWrapper({
        data: { createFoo: { success: true } },
      });

      expect(wrapper.mutationName).toBe('createFoo');
    });

    it('returns undefined if no data', () => {
      const wrapper = new GraphqlResponseWrapper({});
      expect(wrapper.mutationName).toBeUndefined();
    });
  });

  describe('hasData', () => {
    it('returns true when data present', () => {
      const wrapper = new GraphqlResponseWrapper({ data: {} });
      expect(wrapper.hasData()).toBe(true);
    });

    it('returns false when no data', () => {
      const wrapper = new GraphqlResponseWrapper({});
      expect(wrapper.hasData()).toBe(false);
    });
  });

  describe('success / failure', () => {
    it('success true if data present and no errors', () => {
      const wrapper = new GraphqlResponseWrapper({ data: {}, errors: [] });
      expect(wrapper.success()).toBe(true);
      expect(wrapper.failure()).toBe(false);
    });

    it('success false if errors present', () => {
      const wrapper = new GraphqlResponseWrapper({
        data: {},
        errors: [{ message: 'Error occurred' }],
      });
      expect(wrapper.success()).toBe(false);
      expect(wrapper.failure()).toBe(true);
    });

    it('success false if no data', () => {
      const wrapper = new GraphqlResponseWrapper({ errors: [] });
      expect(wrapper.success()).toBe(false);
      expect(wrapper.failure()).toBe(true);
    });
  });

  describe('errors / errorMessages', () => {
    it('returns empty array if no errors', () => {
      const wrapper = new GraphqlResponseWrapper({ data: {} });
      expect(wrapper.errors()).toEqual([]);
      expect(wrapper.errorMessages()).toEqual([]);
    });

    it('returns errors and messages', () => {
      const wrapper = new GraphqlResponseWrapper({
        data: {},
        errors: [{ message: 'Oops' }, { message: 'Another error' }],
      });

      expect(wrapper.errors()).toEqual([
        { message: 'Oops' },
        { message: 'Another error' },
      ]);
      expect(wrapper.errorMessages()).toEqual(['Oops', 'Another error']);
    });
  });

  describe('formattedErrors', () => {
    it('returns <none> if no errors', () => {
      const wrapper = new GraphqlResponseWrapper({ data: {} });
      expect(wrapper.formattedErrors()).toEqual([colours.greenText('<none>')]);
    });

    it('returns single error formatted', () => {
      const wrapper = new GraphqlResponseWrapper({
        data: {},
        errors: [{ message: 'Oops' }],
      });
      expect(wrapper.formattedErrors()).toEqual([colours.redText('Oops')]);
    });

    it('returns multiple errors formatted', () => {
      const wrapper = new GraphqlResponseWrapper({
        data: {},
        errors: [{ message: 'Error 1' }, { message: 'Error 2' }],
      });

      expect(wrapper.formattedErrors()).toEqual([
        `- ${colours.redText('Error 1')}`,
        `- ${colours.redText('Error 2')}`,
      ]);
    });
  });

  describe('formattedResponse', () => {
    it('returns full formatted response', () => {
      const input = {
        data: { foo: 123 },
        errors: [{ message: 'Error' }],
      };

      const wrapper = new GraphqlResponseWrapper(input);
      expect(wrapper.formattedResponse()).toBe(JSON.stringify(input, null, 2));
    });
  });

  describe('constructor handles string input', () => {
    it('parses stringified response', () => {
      const json = JSON.stringify({ data: { foo: 1 }, errors: [] });
      const wrapper = new GraphqlResponseWrapper(json);

      expect(wrapper.dataRaw).toEqual({ foo: 1 });
      expect(wrapper.errors()).toEqual([]);
    });
  });
});