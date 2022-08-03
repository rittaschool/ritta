import dayjs from "dayjs";

export const unixSinceMidnight = (date?: string | number | Date | dayjs.Dayjs | null | undefined) =>
  dayjs(date).unix() - dayjs(date).startOf("day").unix();
