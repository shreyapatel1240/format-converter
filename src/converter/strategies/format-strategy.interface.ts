import { Canonical } from '../types/canonical';

export interface IFormatStrategy {
  // Converts content to canonical format
  parseToCanonical(
    content: string,
    options?: any,
  ): Canonical | Promise<Canonical>;

  // Converts canonical to the specified format
  fromCanonical(canonical: Canonical, options?: any): string;

  // type of the format (json | string | xml)
  getFormatType(): string;
}
