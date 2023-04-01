import { Injectable } from '@nestjs/common';
import * as chrono from 'chrono-node';
import * as dayjs from 'dayjs';
import * as utc from 'dayjs/plugin/utc';
import * as customParseFormat from 'dayjs/plugin/customParseFormat';
import * as timezone from 'dayjs/plugin/timezone';
import * as duration from 'dayjs/plugin/duration';
import * as relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/en';
import 'dayjs/locale/es';
import { Locales } from '@shared/types/constants.type';
dayjs.extend(utc);
dayjs.extend(customParseFormat);
dayjs.extend(timezone);
dayjs.extend(duration);
dayjs.extend(relativeTime);
dayjs.locale('es');

@Injectable()
export class DateService {
  static dayjsInstance() {
    return dayjs;
  }

  static dayjs(date = undefined, format = null) {
    return dayjs.utc(date, format);
  }

  static unixToDate(date = undefined) {
    return dayjs.unix(date).toDate();
  }

  static isPast(date: Date): boolean {
    return dayjs(date).tz(dayjs.tz.guess()).isBefore(dayjs());
  }

  static isFuture(date: Date): boolean {
    return dayjs(date).isAfter(dayjs());
  }

  static toFormat(date = undefined, format = 'DD/MM/YYYY') {
    return dayjs(date).format(format);
  }

  static parse(string: string, timezone = 'Etc/GMT') {
    const localTime = dayjs.tz(new Date(), timezone)
    const localOffset = localTime.utcOffset();
    const custom = chrono.casual.clone();
    custom.refiners.push({
      refine: (context, results) => {
        results.forEach((result) => {
          result.start.imply('timezoneOffset', localOffset)
          result.end && result.end.imply('timezoneOffset', localOffset)
        })
        return results
      }});
    const date = custom.parseDate(string);
    if ( !date ) return null;
    return dayjs(date);
  }

  static toMessage(date: Date, locale = Locales.EN, timezone = 'Etc/GMT') {
    const tzDate = dayjs(date).tz(timezone).locale(locale);

    const thisYearformat = locale === Locales.ES
      ? '[el] D [de] MMMM [a las] H:mm'
      : 'MMMM D [at] H:mm';
    const otherYearformat = locale === Locales.ES
      ? '[el] D [de] MMMM [de] YYYY [a las] H:mm'
      : 'MMMM D, YYYY [at] H:mm';

    return tzDate.isBefore(dayjs().endOf('year'))
      ? tzDate.format(thisYearformat)
      : tzDate.format(otherYearformat);
  }
}
