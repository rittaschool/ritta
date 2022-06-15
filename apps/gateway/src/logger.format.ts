import { Format as SomeFormat } from 'logform';
import { format } from 'winston';

const { printf, combine, timestamp, colorize, json } = format;

export const loggerFormat: SomeFormat = combine(
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

export const consoleFormat: SomeFormat = combine(colorize(), loggerFormat);

export const fileFormat: SomeFormat = combine(timestamp(), json());
