export interface INode {
  id: string;
  nodeName: string;
  content: INode[] | string;
  color?: string;
  groups?: [];
}

export interface IResponse {
  data: Array<INode>;
}

export interface Component {
  connectedCallback(): void;
  disconnectedCallback(): void;
  adoptedCallbac(): void;
  attributeChangedCallback(): void;
  observedAttributes(): void;
}
