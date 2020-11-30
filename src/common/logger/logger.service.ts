import { Injectable, LoggerService } from '@nestjs/common';
import { createLogger, transports, format } from 'winston';
import * as winston from 'winston';

import { logLevel } from '@/common/config';

export interface CustomLogger {
  error: (message: string) => void;
  warn: (message: string) => void;
  info: (message: string) => void;
  verbose: (message: string) => void;
  debug: (message: string) => void;
}

@Injectable()
export class Logger implements LoggerService {
  private logger: winston.Logger;

  constructor() {
    const TAB_SIZE = 8;
    this.logger = createLogger({
      level: logLevel,
      transports: [
        new transports.Console({
          format: format.combine(
            format.timestamp({ format: 'YYYY/MM/DDThh:mm:ss' }),
            format.printf(
              ({ level, message, label, timestamp: time }) =>
                `[ ${' '.repeat(TAB_SIZE - level.length)}${level} @ ${time}] ` +
                `- ${label ? `${label}: ` : ''}${message}`,
            ),
            format.colorize({ all: true }),
          ),
        }),
      ],
    });
  }

  /**
   * Sets a custom label for all the calls in the logger.
   * @param label The label to use whenever the returned object functions are
   * invoked.
   * @returns A CustomLogger with label.
   */
  customLogger(label: string): CustomLogger {
    this.logger.info(`Logger: Custom logger (${label}) created`);
    return {
      info: (message: string) => this.info(message, label),
      error: (message: string) => this.error(message, label),
      warn: (message: string) => this.warn(message, label),
      debug: (message: string) => this.debug(message, label),
      verbose: (message: string) => this.verbose(message, label),
    };
  }

  /**
   * Logs messages.
   * @param message Message to log.
   * @param label Label associated to log (optional).
   * @param level Log level. Default info.
   */
  log(message: string, label?: string, level = 'info'): void {
    // Has to validate because NestJS sends level as true
    level = typeof level !== 'string' ? 'info' : level;
    this.logger.log(level, message, { label });
  }

  /**
   * Logs info messages.
   * @param message Message to log.
   * @param label Label associated to log (optional).
   */
  info(message: string, label?: string): void {
    this.logger.info(message, { label });
  }

  /**
   * Logs error messages.
   * @param message Message to log.
   * @param label Label associated to log (optional).
   */
  error(message: string, label?: string): void {
    this.logger.error(message, { label });
  }

  /**
   * Logs warn messages.
   * @param message Message to log.
   * @param label Label associated to log (optional).
   */
  warn(message: string, label?: string): void {
    this.logger.warn(message, { label });
  }

  /**
   * Logs debug messages.
   * @param message Message to log.
   * @param label Label associated to log (optional).
   */
  debug(message: string, label?: string): void {
    this.logger.debug(message, { label });
  }

  /**
   * Logs verbose messages.
   * @param message Message to log.
   * @param label Label associated to log (optional).
   */
  verbose(message: string, label?: string): void {
    this.logger.verbose(message, { label });
  }
}
