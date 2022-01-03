# X-Charts

## Goals

X-Charts is my little X-mas experimentation and proof of concept for a simple charting library which has following characteristics:

- no-JS initiation, `convention over configuration` approach
- wrapped in Web Components & TS
- simple and powerful CSS customization

## Rationale

Firstly, I am inspired by https://github.com/ChartsCSS/charts.css and similar attempts, because I believe as much as possible of styling could be customizable through CSS. Its much more intuitive for customization then using JS.

Secondly, we should strive for more intuitive way how to structure and declare chart using current html conventions, meaning, instead of learning charting library and JS methods, one relies on web standards conventions (to a certain degreee).

## Basic example

```html
<x-chart src="./data.json" key="data">
  <template pending><span part="pendingMsg">Chart is loading </span>...</template>
  <template catch><span part="catchMsg">Ups... something went wrong :(</span></template>
  <template then>
    <x-bar-chart by-key="name" type="stacked" filter-by="[age, city]" orientation="vertical" />
    <x-chart-tooltip></x-chart-tooltip>
  </template>
</x-chart>
```

- idea for templating async behaviour taken from conditional rendering feature of Aurelia 2. [See](https://docs.aurelia.io/getting-to-know-aurelia/introduction/built-in-template-features/promise.bind)

To override styling in the shadow dom, `::part` pseudoselector could be used.

```html
<style>
  x-chart::part(wrapper) {
    height: 500px;
    width: 800px;
  }
</style>
```

Or CSS variables, which they DO enter shadow tree. See https://vaadin.com/learn/tutorials/css-variables

## Blockers

- experimental shadow parts `::part()` pseudoselector https://www.w3.org/TR/css-shadow-parts-1/#exportparts-attr
- issues with multiple shadow roots and nesting which limits use of `::part()`
- no nice way to add CSS to custom elements https://css-tricks.com/thinking-through-styling-options-for-web-components/
- limited use of constructable stylesheets https://developers.google.com/web/updates/2019/02/constructable-stylesheets
- sadly its not possible to create self-closing custom elements https://github.com/WICG/webcomponents/issues/624, woudl be nice for `<x-chart-data src="data.json" />`

## Beyond

Fun ides to test and play around.

### Data element & data handling library

The question is whether its even reasonable to attempt to add some basic functionality of data preparation to custom element form w/ attributes (eg., `group-by-key`). This seems to be too much.

However this could be handy for small datasets:

```html
<x-chart prefix="simple-bar-chart">
  <x-data key="data" type="stacked" filter-by="[temp, city]">
    <script type="application/json">
      {
        "data": [
          {
            "temp": 22,
            "city": "a"
          },
          {
            "temp": 22,
            "city": "b"
          },
          {
            "temp": 22,
            "city": "d"
          },
          {
            "temp": 22,
            "city": "e"
          }
        ]
      }
    </script>
  </x-data>
  ....
</x-chart>
```

### More structure like chart

How to broken down a chart which follows XML structure? Eg. <table> . The open question is whether it is even achievable and what are reasonable limits of abstraction.

```html
<x-chart prefix="simple-bar-chart">
  <x-data async src="./api/data" key="data" filter-by="[temp, city]">
    <template pending>Cool pending animation</template>
    <template cathc>Ups ...</template>
    <template then>
      <x-graph>
        <x-chart-axis> </x-chart-axis>
      </x-graph>
    </template>
  </x-data>
  ....
</x-chart>
```

- look into https://link.springer.com/content/pdf/10.1007%2F3-540-44541-2_6.pdf
- https://stackoverflow.com/questions/12905230/representing-a-graph-in-xml
