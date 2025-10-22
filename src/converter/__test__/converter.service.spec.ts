/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access */
// import { Test, TestingModule } from '@nestjs/testing';
// import { ConverterService } from '../converter.service';
import { mockJson, mockString, mockXml } from './mock-data';
import { canonicalToXml, parseXmlToCanonical } from '../../utils/xml.utils';
import {
  parseJsonToCanonical,
  parseStringToCanonical,
} from '../../utils/parser.utils';
import {
  canonicalToJson,
  canonicalToString,
} from '../../utils/converter.utils';

describe('ConverterService', () => {
  // let service: ConverterService;

  // beforeEach(async () => {
  //   const module: TestingModule = await Test.createTestingModule({
  //     providers: [ConverterService],
  //   }).compile();

  //   service = module.get<ConverterService>(ConverterService);
  // });

  describe('convertStringToJson', () => {
    it('should convert formatted string to JSON correctly', () => {
      const canonicalString = parseStringToCanonical(mockString, '~', '*');
      const result = canonicalToJson(canonicalString);
      expect(result).toEqual(mockJson);
    });

    it('should handle empty input string', () => {
      const result = parseStringToCanonical('', '~', '*');
      expect(result).toEqual([]);
    });

    it('should handle input with missing elements gracefully', () => {
      const input = 'ProductID*1**3~';
      const canonical = parseStringToCanonical(input, '~', '*');
      const result = canonicalToJson(canonical);
      expect(result.ProductID[0].ProductID2).toBe('');
    });

    it('should handle multiple separator types', () => {
      const input = 'User|1|2|3#User|4|5|6#';
      const canonical = parseStringToCanonical(input, '#', '|');
      const result = canonicalToJson(canonical);
      expect(result.User.length).toBe(2);
    });
  });

  describe('convertJsonToString', () => {
    it('should convert JSON to formatted string', () => {
      const canonical = parseJsonToCanonical(JSON.stringify(mockJson));
      const result = canonicalToString(canonical, '~', '*');
      expect(result).toContain('ProductID*4*8*15*16*23~');
      expect(result).toContain('ContactID*59*26~');
    });

    it('should handle empty JSON input', () => {
      const canonical = parseJsonToCanonical('{}');
      const result = canonicalToString(canonical, '~', '*');
      expect(result).toBe('');
    });
  });

  describe('convertJsonToXml', () => {
    it('should convert JSON to XML correctly', () => {
      const canonical = parseJsonToCanonical(JSON.stringify(mockJson));
      const xml = canonicalToXml(canonical);
      expect(xml).toContain('<ProductID1>4</ProductID1>');
      expect(xml).toContain('<ContactID2>26</ContactID2>');
    });

    it('should handle empty JSON input gracefully', () => {
      const canonical = parseJsonToCanonical('{}');
      const xml = canonicalToXml(canonical);
      expect(xml).toContain(``);
    });
  });

  describe('convertXmlToJson', () => {
    it('should convert XML to JSON correctly', async () => {
      const canonical = await parseXmlToCanonical(mockXml);
      const result = canonicalToJson(canonical);
      expect(result.ContactID[0].ContactID1).toBe('59');
      expect(result.ContactID[0].ContactID2).toBe('26');
    });

    it('should handle malformed XML gracefully', async () => {
      const badXml = '<root><UnclosedTag>';
      await expect(parseXmlToCanonical(badXml)).rejects.toThrow();
    });
  });
});
