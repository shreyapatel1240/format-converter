import { JsonFormatStrategy } from '../strategies/formats/json-format.strategy';

describe('JsonFormatStrategy', () => {
  const strategy = new JsonFormatStrategy();

  it('should parse valid JSON to canonical', () => {
    const json = '{"ContactID": [{"ContactID1": "59"}]}';
    const canonical = strategy.parseToCanonical(json);
    expect(canonical).toEqual([{ name: 'ContactID', elements: ['59'] }]);
  });

  it('should fail on invalid JSON', () => {
    const invalid = '{"ContactID": [}';
    expect(() => strategy.parseToCanonical(invalid)).toThrow(
      `Invalid JSON format provided in the document SyntaxError: Unexpected token '}', "{"ContactID": [}" is not valid JSON`,
    );
  });
});
