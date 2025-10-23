import { FormatStrategyRegistry } from '../strategies/format-strategy.registry';
import { JsonFormatStrategy } from '../strategies/formats/json-format.strategy';

describe('FormatStrategyRegistry', () => {
  let registry: FormatStrategyRegistry;

  beforeEach(() => {
    registry = new FormatStrategyRegistry();
  });

  it('should register and retrieve a strategy', () => {
    const jsonStrategy = new JsonFormatStrategy();
    registry.register(jsonStrategy);
    const found = registry.get('json');
    expect(found).toBe(jsonStrategy);
  });

  it('should throw when format not supported', () => {
    expect(() => registry.get('unknown')).toThrow(
      'Format not supported: unknown',
    );
  });
});
