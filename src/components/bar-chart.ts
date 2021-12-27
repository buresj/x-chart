import { Tag } from '../framework';
import { ComponentLogger } from '../framework/logger/Log';
import { Component } from '../framework/types';

const logger = new ComponentLogger('BarChart');

@Tag('x-bar-chart')
export class XBarChart extends HTMLElement implements Partial<Component> {
  constructor() {
    super();
    this.initialize();
  }

  get data(): any[] {
    return new Array(10).fill(null).map((n, i) => ({
      value: Math.floor((Math.random() * 100 * i) / 2),
      label: i.toString(),
    }));
  }

  get wrapper(): HTMLDivElement {
    return this.shadowRoot!.querySelector('div')!;
  }

  @logger.invoke()
  public async connectedCallback(): Promise<void> {
    this.render();
  }

  @logger.invoke()
  private render(update = false): void {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('height', `${300}px`);
    svg.setAttribute('width', `${400}px`);

    for (const [i, { value, label }] of this.data.entries()) {
      const dataColumn = this.createCol(value, this.data.length, i, label);
      svg.appendChild(dataColumn);
    }

    logger.data({ svg });
    this.wrapper.appendChild(svg);
  }

  @logger.invoke()
  private createCol(
    height: number,
    totalItems: number,
    position: number,
    id?: string,
    m = 10,
    l = 300
  ): SVGRectElement {
    const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    const posX = position * (l / totalItems) + position * m;

    rect.setAttribute('x', `${posX}`);
    rect.setAttribute('y', `${l - height}`);
    rect.setAttribute('height', `${height}px`);
    rect.setAttribute('width', `${l / totalItems - m}px`);
    rect.setAttribute('part', `${'column-' + id}`);
    logger.data({ rect });

    return rect;
  }

  @logger.invoke()
  private initialize(rerender = false) {
    if (rerender) {
      this.shadowRoot!.innerHTML = '';
    }

    const template = document.createElement('template');
    template.innerHTML = `
    
    <div part="wrapper">
    </div>`;

    if (!rerender) {
      this.attachShadow({ mode: 'open' });
    }

    this.shadowRoot!.appendChild(template.content.cloneNode(true));

    this.getStyleSheet();
  }

  @logger.invoke()
  private async getStyleSheet() {
    // err in TS interface?
    const sheet = new CSSStyleSheet() as any;

    // cannot use @import https://developers.google.com/web/updates/2019/02/constructable-stylesheets
    await sheet.replaceSync('rect{ fill: red};}');
    logger.data({ sheet });

    (this.shadowRoot! as any).adoptedStyleSheets = [sheet];
  }
}
