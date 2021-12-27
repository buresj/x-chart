import { LoggerFactory } from './LoggerFactory';

const logger = LoggerFactory.getInstance();

export class ComponentLogger {
  invoked: string = '';

  constructor(private name: string) {}

  public invoke(name = this.name) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
      const targetMethod = descriptor.value;

      descriptor.value = function (...args: any[]) {
        logger.log(name, propertyKey);

        return targetMethod.apply(this, args);
      };

      return descriptor;
    };
  }

  public data(data?: any) {
    logger.log(this.name, '', data);
  }
}
