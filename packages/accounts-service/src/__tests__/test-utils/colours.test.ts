import colours from '@test-utils/colours';

describe('colours utility', () => {
  const RESET = '\x1b[0m';

  const cases = [
    { fn: colours.boldText, prefix: colours.bold, name: 'boldText' },
    { fn: colours.redText, prefix: colours.red, name: 'redText' },
    { fn: colours.greenText, prefix: colours.green, name: 'greenText' },
    { fn: colours.yellowText, prefix: colours.yellow, name: 'yellowText' },
    { fn: colours.blueText, prefix: colours.blue, name: 'blueText' },
    { fn: colours.magentaText, prefix: colours.magenta, name: 'magentaText' },
    { fn: colours.cyanText, prefix: colours.cyan, name: 'cyanText' },
    { fn: colours.whiteText, prefix: colours.white, name: 'whiteText' },
  ];

  cases.forEach(({ fn, prefix, name }) => {
    it(`formats text correctly for ${name}`, () => {
      const input = 'hello world';
      const result = fn(input);

      expect(result).toBe(`${prefix}${input}${RESET}`);
    });
  });
});