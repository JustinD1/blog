import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import timezone from "dayjs/plugin/timezone.js";

dayjs.extend(utc)
dayjs.extend(timezone)

const convertServerTimeToDayjs = (datetime) => {
  const parsedDatetime = dayjs.utc(datetime);
  if (!parsedDatetime) {
    throw new Error(`Invalid date format: ${datetime}`);
  }
  return parsedDatetime;
}

export const FormatStandardUK = ({datetime}) => {
  if (datetime === null || datetime === undefined) {
    return null;
  }
  const localTime = convertServerTimeToDayjs(datetime).local();
  return localTime.format('YYYY-MM-DD HH:mm');
}

export const isFuture = ({datetime}) => {
  if (datetime === null || datetime === undefined) {
    return null;
  }
  const serverTime = convertServerTimeToDayjs(datetime);
  return serverTime.isAfter(dayjs().utc());
}
