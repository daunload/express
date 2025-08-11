
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';

dayjs.extend(utc);

export const isValidUTCISO = (date: string) => {
    return dayjs.utc(date,  "YYYY-MM-DDTHH:mm:ss[Z]", true).isValid();
}