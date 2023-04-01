import dayjs from 'dayjs';
import 'dayjs/locale/es';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(duration);
dayjs.extend(relativeTime);
dayjs.locale(navigator.language || navigator.userLanguage || 'en');
import timezone from 'dayjs/plugin/timezone';
dayjs.extend(timezone);
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

export default {
  install: (app) => {
    const date = {
      toHuman: (date, showTime = true) => {
        if ( dayjs(date).isAfter(dayjs().endOf('day')) ) {
          const timeString = showTime ? ' [a las] HH:mm' : '';
          return dayjs(date).isBefore(dayjs().endOf('year'))
            ? dayjs(date).format(`el DD [de] MMMM${timeString}`)
            : dayjs(date).format(`el DD [de] MMMM [de] YYYY${timeString}`);
        }
        const minutesLeft = dayjs().diff(date, 'minute') * -1;
        return dayjs.duration(minutesLeft, "minutes").humanize(true);
      },
      toReminder: (date) => {
        return dayjs(date).isBefore(dayjs().endOf('year'))
          ? dayjs(date).format('MMMM D [at] HH:mm')
          : dayjs(date).format('MMMM D, YYYY [at] HH:mm');
      },
      fromUnix: (date) => {
        const timestamp = typeof date === 'number'
          ? dayjs.unix(date)
          : dayjs(date);
        return timestamp.isBefore(dayjs().endOf('year'))
          ? timestamp.format('MMMM D [at] HH:mm')
          : timestamp.format('MMMM D, YYYY [at] HH:mm');
      },
      format: (date, format) => dayjs.unix(date).format(format),
      today: dayjs(),
      toDMY: (date) => dayjs(date).format('DD/MM/YYYY'),
      toDayjs: (date) => dayjs(date),
    };
    app.config.globalProperties.$date = date;
    app.provide('date', date);
  }
}
