import winston from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

const logFormat = winston.format.combine(
  winston.format.timestamp({
    format: "YYYY-MM-DD HH:mm:ss",
  }),
  winston.format.errors({
    stack: true,
  }),
  winston.format.json()
);

const transport = new DailyRotateFile({
  filename: "logs/app-%DATE%.log",
  datePattern: "YYYY-MM-DD",
  maxSize: "20m",
  maxFiles: "14d",
});

const errorTransport =
  new DailyRotateFile({
    filename:
      "logs/error-%DATE%.log",
    level: "error",
    datePattern: "YYYY-MM-DD",
    maxSize: "20m",
    maxFiles: "30d",
  });

export const logger =
  winston.createLogger({
    level: "info",
    format: logFormat,
    transports: [
      transport,
      errorTransport,
      new winston.transports.Console({
        format:
          winston.format.combine(
            winston.format.colorize(),
            winston.format.simple()
          ),
      }),
    ],
  });