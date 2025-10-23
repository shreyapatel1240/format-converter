import { BadRequestException, Logger } from '@nestjs/common';
import { IFormatStrategy } from './format-strategy.interface';
import { JsonFormatStrategy } from './formats/json-format.strategy';
import { StringFormatStrategy } from './formats/string-format.strategy';
import { XmlFormatStrategy } from './formats/xml-format.strategy';

export class FormatStrategyRegistry {
  private readonly logger = new Logger(FormatStrategyRegistry.name);
  private readonly strategies: Map<string, IFormatStrategy> = new Map();

  constructor() {
    this.register(new JsonFormatStrategy());
    this.register(new StringFormatStrategy());
    this.register(new XmlFormatStrategy());
  }

  register(strategy: IFormatStrategy) {
    const key = strategy.getFormatType();

    this.strategies.set(key, strategy);
  }

  get(format: string): IFormatStrategy {
    const strategy = this.strategies.get(format.toLowerCase());

    if (!strategy) {
      this.logger.error(`Format not supported: ${format}`);
      throw new BadRequestException(`Format not supported: ${format}`);
    }

    return strategy;
  }
}
