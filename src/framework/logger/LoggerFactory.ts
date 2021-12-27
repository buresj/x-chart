import { Logger } from '../types';
import { ConsoleLogger } from './ConsoleLogger';

let logger: Logger;

export class LoggerFactory {
  public static getInstance(): Logger {
    if (!logger) {
      logger = new ConsoleLogger();
    }
    return logger;
  }
}
