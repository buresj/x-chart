import { Tag } from '../framework';
import { ComponentLogger } from '../framework/logger/Log';
import { Component } from '../framework/types';

const logger = new ComponentLogger('Chart');

@Tag('x-chart')
export class XChart extends HTMLElement implements Partial<Component> {
  constructor() {
    super();
  }

  get wrapper(): HTMLDivElement {
    return this.shadowRoot!.querySelector('div')!;
  }

  get pendingTemplate(): HTMLTemplateElement | null {
    return this.querySelector('[pending]');
  }

  get catchTemplate(): HTMLTemplateElement | null {
    return this.querySelector('[catch]');
  }

  get thenTemplate(): HTMLTemplateElement | null {
    return this.querySelector('[then]');
  }

  get prefix(): string {
    return this.getAttribute('prefix') || '';
  }

  @logger.invoke()
  public async connectedCallback(): Promise<void> {
    this.render();
    const data = await this.getData();
    logger.data({ data });
  }

  disconnectedCallback(): void {}

  @logger.invoke()
  private async getData(): Promise<any[]> {
    const dataSrc = this.getAttribute('src');
    const dataKey = this.getAttribute('key');

    this.setAttribute('loading', '');
    logger.data({ wrapper: this.wrapper });


    const content = this.pendingTemplate?.content.cloneNode(true)!;
    this.wrapper!.appendChild(content);

    // simulate async
    await this.sleep();

    // TODO rework
    if (dataSrc && dataKey) {
      let json;

      try {
        const res = await fetch(dataSrc);
        json = await res.json();
      } catch (e) {
        this.render(true);
        this.appendChild(this.catchTemplate!.cloneNode(true)!);
      }

      if (typeof json === 'object') {
        const dataArray = json[dataKey];
        if (Array.isArray(dataArray)) {
          this.render(true);
          this.wrapper.appendChild(this.thenTemplate!.content.cloneNode(true)!);

          return dataArray;
        }
      }
    }

    this.removeAttribute('loading');

    return [];
  }

  // TODO create render interface & move to abstract class XChartComponent
  @logger.invoke()
  private render(update = false) {
    if (update) {
      this.shadowRoot!.innerHTML = '';
    }

    const template = document.createElement('template');

    // TODO can we handle this in .html ?, import as .htm
    template.innerHTML = `
    <div part="wrapper">
      <slot></slot>
    </div>`;

    if (!update) {
      this.attachShadow({ mode: 'open' });
    }

    this.shadowRoot!.appendChild(template.content.cloneNode(true));
  }

  //TODO utils
  private async sleep() {
    return new Promise((resolve) => setTimeout(() => resolve(null), 2000));
  }
}
