import { DateService } from "@shared/services/date.service";

const tests = {
  'el 23 de diciembre a las 12:12': DateService.dayjs('2022-12-23T11:12:00.000+00:00').toDate(),
  'el 23 de diciembre de 2023 a las 12:12': DateService.dayjs('2023-12-23T11:12:00.000+00:00').toDate(),
};

describe('FormatService', () => {
  describe('dateToMessage', () => {
    it('should show date as string', () => {
      for (const key of Object.keys(tests)) {
        expect(DateService.toMessage(tests[key])).toStrictEqual(key);
      }
    });
  });
});
