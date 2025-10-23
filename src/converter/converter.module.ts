import { Module } from '@nestjs/common';
import { ConverterController } from './converter.controller';
import { ConverterService } from './converter.service';
import { FormatStrategyRegistry } from './strategies/format-strategy.registry';

@Module({
  controllers: [ConverterController],
  providers: [ConverterService, FormatStrategyRegistry],
})
export class ConverterModule {}
