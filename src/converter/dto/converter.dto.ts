import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export enum FormatType {
  json = 'json',
  string = 'string',
  xml = 'xml',
}

export class ConverterDto {
  @ApiProperty({
    description: 'The document that needs to be coverted (JSON | String | XML)',
  })
  @IsNotEmpty()
  document: any;

  @ApiProperty({
    description: 'The format to convert to',
    enum: FormatType,
  })
  @IsString()
  @IsEnum(FormatType)
  format: FormatType;

  @ApiPropertyOptional({
    description: 'Segment seperator',
    default: '~',
  })
  @IsOptional()
  @IsString()
  segmentSeparator?: string = '~';

  @ApiPropertyOptional({
    description: 'Element seperator',
    default: '*',
  })
  @IsOptional()
  @IsString()
  elementSeparator?: string = '*';
}
