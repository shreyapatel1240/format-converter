import { XmlFormatStrategy } from '../strategies/formats/xml-format.strategy';

describe('XmlFormatStrategy', () => {
  const strategy = new XmlFormatStrategy();

  it('should parse valid XML', async () => {
    const xml = `<root><ContactID><ContactID1>59</ContactID1></ContactID></root>`;
    const canonical = await strategy.parseToCanonical(xml);

    expect(canonical).toEqual([{ name: 'ContactID', elements: ['59'] }]);
  });
});
