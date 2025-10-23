import { StringFormatStrategy } from '../strategies/formats/string-format.strategy';

describe('StringFormatStrategy', () => {
  const strategy = new StringFormatStrategy();

  it('should parse string with valid separators', () => {
    const str = 'ProductID*4*8*15*16*23~';
    const canonical = strategy.parseToCanonical(str, {
      elementSeparator: '*',
      segmentSeparator: '~',
    });
    expect(canonical).toEqual([
      { name: 'ProductID', elements: ['4', '8', '15', '16', '23'] },
    ]);
  });

  it('should throw error for missing separators', () => {
    const str = 'ProductID*4*8*15*16*23~';
    expect(() => strategy.parseToCanonical(str, {} as any)).toThrow(
      `segmentSeparator and elementSeparator are required for the string format`,
    );
  });
});
