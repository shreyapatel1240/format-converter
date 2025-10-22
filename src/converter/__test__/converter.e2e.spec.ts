import { Test, TestingModule } from '@nestjs/testing';
import { ConverterService } from '../converter.service';
import { mockJson, mockString } from './mock-data';
import { FormatType } from '../dto/converter.dto';
import { ConverterRequestBody } from '../types/converter.request';

describe('ConverterController (e2e)', () => {
  let service: ConverterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConverterService],
    }).compile();

    service = module.get<ConverterService>(ConverterService);
  });

  it('should convert STRING -> JSON', async () => {
    const body: ConverterRequestBody = {
      format: FormatType.json,
      segmentSeparator: '~',
      elementSeparator: '*',
    };

    const content = mockString;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const result = await service.convert(
      content,
      body.format,
      body.segmentSeparator,
      body.elementSeparator,
    );

    expect(result).toEqual(mockJson);
  });
});
