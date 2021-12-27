import { Logger } from './../types';

export class ConsoleLogger implements Logger {
  mode: string | null = '';
  namespace: string | null = '';

  constructor() {
    const storedOrchard = localStorage.getItem('orchard');

    if (storedOrchard) {
      const { mode, namespace } = JSON.parse(storedOrchard);
      this.mode = mode;
      this.namespace = namespace;
    }
  }

  public log(component: string, call: string, data?: any): void {
    if (this.namespace && this.namespace !== component) {
      return;
    }

    console.log(
      `%c${component}%c::%c${call}`,
      'color: orange; text-transform: uppercase',
      'color: white',
      'color: cyan',
      data || ''
    );

    if (this.mode === 'debug') {
      console.groupCollapsed();
      console.trace();
      console.groupEnd();
    }
  }
}

export interface LoggerConfig {
  mode: string | null;
  namespace: string | null;
}
