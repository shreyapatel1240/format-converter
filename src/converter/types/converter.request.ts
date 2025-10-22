import { FormatType } from '../dto/converter.dto';

export type ConverterRequestBody = {
  format: FormatType;
  segmentSeparator?: string;
  elementSeparator?: string;
};
