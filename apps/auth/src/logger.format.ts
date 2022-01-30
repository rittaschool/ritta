import { format } from 'winston';

const { printf, combine, timestamp, colorize } = format;

export const loggerFormat = combine(
  timestamp(),
  printf(({ level, message, context, timestamp, rid }) => {
    let msg = message;
    let ridC = ` [${rid}]`;
    let lvl = level;

    if (!message) msg = 'no message';
    if (!rid) ridC = '';
    if (!level) lvl = 'info';

    return `${timestamp} ${lvl}: [${context}]${ridC} ${msg}`;
  }),
);

export const consoleFormat = combine(colorize(), loggerFormat);
