import {
  utilities as nestWinstonModuleUtilities,
  WinstonModule,
} from 'nest-winston';
import winstonDaily, {
  DailyRotateFileTransportOptions,
} from 'winston-daily-rotate-file';
import * as winston from 'winston';
import path from 'path';

const isProduction = process.env.NODE_ENV === 'production';
const logDir = path.resolve(__dirname, '../../logs');

const dailyOptions = (level: string): DailyRotateFileTransportOptions => {
  return {
    level,
    datePattern: 'YYYY-MM-DD',
    dirname: logDir + `/${level}`,
    filename: `%DATE%.${level}.log`,
    zippedArchive: isProduction,
    maxSize: '20m',
    maxFiles: '14d',
  };
};

export const winstonLogger = WinstonModule.createLogger({
  transports: [
    new winston.transports.Console({
      level: isProduction ? 'info' : 'silly',
      format: isProduction
        ? winston.format.simple()
        : winston.format.combine(
            winston.format.timestamp(),
            winston.format.ms(),
            nestWinstonModuleUtilities.format.nestLike('Nest', {
              colors: true,
              prettyPrint: true,
            }),
          ),
    }),
    new winstonDaily(dailyOptions('info')),
    new winstonDaily(dailyOptions('warn')),
    new winstonDaily(dailyOptions('error')),
  ],
});
