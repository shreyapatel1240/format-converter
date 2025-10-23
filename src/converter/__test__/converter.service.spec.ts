/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Test, TestingModule } from '@nestjs/testing';
import { ConverterService } from '../converter.service';
import { FormatStrategyRegistry } from '../strategies/format-strategy.registry';
import { JsonFormatStrategy } from '../strategies/formats/json-format.strategy';
import { StringFormatStrategy } from '../strategies/formats/string-format.strategy';
import { XmlFormatStrategy } from '../strategies/formats/xml-format.strategy';
import { FormatType } from '../dto/converter.dto';
import { mockJson, mockString } from './mock-data';

describe('ConverterService', () => {
  let service: ConverterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConverterService,
        FormatStrategyRegistry,
        JsonFormatStrategy,
        XmlFormatStrategy,
        StringFormatStrategy,
      ],
    }).compile();

    service = module.get<ConverterService>(ConverterService);
  });

  it('should convert string -> json correctly', async () => {
    const content = mockString;
    const result = await service.convert(content, FormatType.json, '~', '*');
    expect(result).toContain('"ProductID"');
    expect(result).toEqual(JSON.stringify(mockJson, null, 2));
  });

  it('should convert xml -> string correctly', async () => {
    const content = `<?xml version="1.0" encoding="UTF-8" ?><root><ProductID><ProductID1>4</ProductID1></ProductID><ContactID><ContactID1>59</ContactID1><ContactID2>26</ContactID2></ContactID></root>`;
    const result = await service.convert(content, FormatType.string);
    expect(result).toEqual(`ProductID*4~ContactID*59*26~`);
  });

  it('should handle empty input', async () => {
    await expect(service.convert('', FormatType.xml)).rejects.toThrow(
      'segmentSeparator and elementSeparator are required for the string format',
    );
  });

  it('should handle whitespace-only strings', async () => {
    const input = '   ';
    await expect(service.convert(input, FormatType.json)).rejects.toThrow();
  });
});
