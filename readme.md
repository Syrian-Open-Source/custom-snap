# Custom Snap - Snap and normal scrolling at once

[![npm version](https://badge.fury.io/js/custom-snap.svg)](https://badge.fury.io/js/custom-snap)
[![CodeFactor](https://www.codefactor.io/repository/github/hasanmothaffar/custom-snap/badge/master)](https://www.codefactor.io/repository/github/hasanmothaffar/custom-snap/overview/master)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

A TypeScript module that lets you have both scroll snapping and native scrolling functionality in different sections of your website.

**Demo link**: https://syrian-open-source.github.io/custom-snap/

<!-- ## Motivation

This is heavily inspired by the `normalScrollElements` option in the fullpage.js library. Scrolling with this option enabled, however, wan't smooth enough for my needs, which is why I created this library. -->

## Features

-   Lightweight and simple (0 dependencies)
-   Works with both fullpage sections (100vh) and variable height sections.
-   You can customize the snap scrolling's duration and easing presets
-   You can have as many normal scroll sections as you want.

## Installation

```sh
npm install custom-snap
```

## Example usage

**HTML structure**

```html
<div id="container">
	<div id="a" class="section"></div>
	<div id="b" class="section"></div>
	<div id="c" class="section long-content"></div>
	<div id="d" class="section"></div>
	<div id="e" class="section long-content"></div>
	<div id="f" class="section"></div>
</div>
```

**CSS**

```css
/* These values are arbitrary. You can choose any height you want */
.section {
	height: 100vh;
}

.long-content {
	height: 200vh;
}
```

**JS**

```js
import { CustomSnap } from "custom-snap";

const scrollInstance = new CustomSnap({
	containerID: "container",
	normalScrollElementIDs: ["c", "e"],
	afterSnap: (id, section) => {},
	beforeSnap: (id, section) => {},
});

scrollInstance.register();
```

In this example, sections with ids `c` and `d` will have normal scrolling, while all other children of `#container` will have snap scrolling.

**Important!**: You have to specify an ID on every child of the container.

### Indexing

Section `a` has index 0, `b` has index 1, and so on... Section `f` has index 5.

This is useful in case you want to scroll programmatically using the `scrollToSectionByIndex` method.

## Options

| Key                    | Description                                                         | Type            | Default value   |
| ---------------------- | ------------------------------------------------------------------- | --------------- | --------------- |
| containerID            | ID of the wrapping container                                        | string          | none            |
| hideScrollbar          | Whether to hide the browser's scrollbar or not                      | boolean         | `false`         |
| normalScrollElementIDs | IDs of the sections to which scroll snapping doesn't apply          | string[]        | `[]`            |
| snapDuration           | The duration that scroll snapping takes in milliseconds             | number          | `1000` (ms)     |
| easingPreset           | The transition timing function that gets applied to snapping        | EasingPreset    | `easeInOutQuad` |
| afterSnap              | A function that gets called after snap scrolling is performed       | OnEventCallback | `() => {}`      |
| beforeSnap             | A function that gets called just before snap scrolling is performed | OnEventCallback | `() => {}`      |

## Methods

```ts
/**
 * Sets a new easing preset for snap scrolling
 */
setEasingPreset(easingPreset: EasingPreset): void

/**
 * Sets a new duration for snap scrolling
 */
setSnapDuration(duration = 1000): void

/**
 * Returns the scroll's direction
 */
getScrollDirection(): ScrollDirection

/**
 * Hides the browser's scrollbar using CSS
 */
hideScrollbar(): void

/**
 * Shows the browser's scrollbar
 */
showScrollbar(): void

/**
 * Scrolls to a specific section over a period of time.
 */
scrollToSectionByIndex(index: number, duration = 1000): void

/**
 * Registers the snap scroll event listener.
 * Note that without invoking this function, all scrolling
 * would be considered normal.
 */
register(): void

/**
 * Removes the currently bound scroll event listener.
 * After unregistering, all scrolling would be considered normal.
 */
unregister(): void
```

## Types

```ts
interface OnEventCallback {
	(id?: number, section?: HTMLElement | null): void;
}

type EasingPreset = "easeInOutQuad" | "easeInCubic" | "inOutQuintic";
type ScrollDirection = "top-to-bottom" | "bottom-to-top" | "";
```

## Inspiration

-   https://gist.github.com/james2doyle/5694700
-   https://github.com/tarun-dugar/easy-scroll
-   https://github.com/alvarotrigo/fullPage.js
-   https://github.com/geomolenaar/LeScroll


## Credits

-	[Linkedin Account](https://www.linkedin.com/in/hasan-mothaffar-0a55301b0/)
-	[GitHub Account](https://github.com/HasanMothaffar)
-	[All contributors](https://github.com/Syrian-Open-Source/custom-snap/graphs/contributors)

## About Syrian Open Source

The Syrian Open Source platform is the first platform on GitHub dedicated to bringing Syrian developers from different cultures and experiences together, to work on projects in different languages, tasks, and versions, and works to attract Syrian developers to contribute more under one platform to open source software, work on it, and issue it with high quality and advanced engineering features, which It stimulates the dissemination of the open-source concept in the Syrian software community, and also contributes to raising the efficiency of developers by working on distributed systems and teams.
