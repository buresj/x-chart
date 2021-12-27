// █▀█ █▀█ █▀▀ █░█ ▄▀█ █▀█ █▀▄
// █▄█ █▀▄ █▄▄ █▀█ █▀█ █▀▄ █▄▀
// v0.0.1

/**
 *
 * @param overrides class names and creates tag name <c-name></c-name>
 * @param ext
 * @returns initailizes document
 */

export function Tag(name?: string, ext?: string) {
  return (constructor: CustomElementConstructor): void => {
    const namex = name || createTagName(constructor.name);
    if (!customElements.get(namex)) {
      ext ? customElements.define(namex, constructor, { extends: ext }) : customElements.define(namex, constructor);
    }
  };
}

export function createStorageItem(key: string, initial: {}): Storage {
  const initialState: string = JSON.stringify(initial);
  const storage: Storage = localStorage;

  return new Proxy(storage, {
    get: (target: Storage, prop: string) => {
      return JSON.parse(target.getItem(key) || initialState)[prop];
    },
    set: (target: Storage, prop: string, value: unknown) => {
      const previousState = JSON.parse(target.getItem(key) || initialState);
      target.setItem(key, JSON.stringify({ ...previousState, [prop]: value }));
      return true;
    },
  });
}

function createTagName(className: string) {
  return (
    'c' +
    className
      .split('')
      .map((character: string) => {
        if (character == character.toUpperCase()) {
          return '-' + character.toLowerCase();
        } else {
          return character;
        }
      })
      .join('')
  );
}

export interface Component {
  connectedCallback(): void;
  disconnectedCallback(): void;
  adoptedCallbac(): void;
  attributeChangedCallback(): void;
  observedAttributes(): void;
}
