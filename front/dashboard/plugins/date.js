import dayjs from 'dayjs';
import 'dayjs/locale/es';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(duration);
dayjs.extend(relativeTime);
dayjs.locale('es');

export default defineNuxtPlugin(app => {
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
        ? dayjs(date).format('DD [de] MMMM [a las] HH:mm')
        : dayjs(date).format('DD [de] MMMM [de] YYYY [a las] HH:mm');
    },
    format: (date, format) => dayjs.unix(date).format(format),
    today: dayjs(),
    toDMY: (date) => dayjs(date).format('DD/MM/YYYY'),
    toDayjs: (date) => dayjs(date),
  };
  return { provide: { date } };
});
