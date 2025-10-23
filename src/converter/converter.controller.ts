/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ConverterService } from './converter.service';
import { FileInterceptor } from '@nestjs/platform-express';
import type { ConverterRequestBody } from './types/converter.request';

@Controller('convert')
@ApiTags('convert')
export class ConverterController {
  constructor(private readonly converterService: ConverterService) {}

  @Post('document')
  @ApiOperation({ summary: 'Convert document to specifed format' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('document'))
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        document: {
          type: 'string',
          format: 'binary',
          description:
            'A document that contains data needs to be formated in a different format.',
        },
        format: {
          type: 'string',
          enum: ['json', 'string', 'xml'],
          description: 'Specify the conversion format',
        },
        segmentSeparator: {
          type: 'string',
          default: '~',
          description:
            'Required if it is a String format. Default segment separator is "~"',
        },
        elementSeparator: {
          type: 'string',
          default: '*',
          description:
            'Required if it is a String format. Default element separator is "*"',
        },
      },
      required: ['document', 'format'],
    },
  })
  async convertDocument(
    @UploadedFile() document: Express.Multer.File,
    @Body()
    body: ConverterRequestBody,
  ): Promise<{ converted: string }> {
    const { format, segmentSeparator, elementSeparator } = body;
    if (!document || !document.buffer) {
      throw new BadRequestException('No document uploaded');
    }

    const content: string = document.buffer.toString('utf-8');
    const converted: any = await this.converterService.convert(
      content,
      format,
      segmentSeparator,
      elementSeparator,
    );

    return { converted };
  }
}
