import { ParserService } from "../services/parser.service";
import cases from './parser.cases';

describe('ParserService.extractEntities', () => {
  for (const key of Object.keys(cases)) {
    it(`should parse "${key}"`, () => {
        expect(ParserService.extractEntities(key)).toStrictEqual(cases[key]);
    });
  }
});
