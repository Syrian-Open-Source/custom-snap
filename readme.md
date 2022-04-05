# Custom Snap - WIP

A plain js solution that lets you have both scroll snapping and native scrolling functionality in different sections of your website.

> This solution does not cover all use cases. Feel free to customize it to your own needs. Pull requests are welcome :)

## Motivation

This is heavily inspired by the `normalScrollElements` option in the fullpage.js library. Scrolling with this option enabled, however, wan't smooth enough for my needs, which is why I created this library.

## Example usage

HTML structure:

```html
<div id="container">
	<div id="a"></div>
	<div id="b"></div>
	<div id="c"></div>
	<div id="d"></div>
	<div id="e"></div>
	<div id="f"></div>
</div>
```

```js
import { CustomSnap } from "custom-snap";

const scrollInstance = new CustomSnap({
	containerID: "container",
	normalScrollElementIDs: ["c", "d"],
	// hideScrollbar: false,
	// snapDuration: 1000,
	// afterSnap: (id, section) => {},
	// beforeSnap: (id, section) => {},
	// easingPreset: "",
});

scrollInstance.register();
```

Specify the sections in which you want to have normal scrolling, and, automatically, all other sections that you didn't specify will have snap scrolling.

**Important!**: You have to specify an ID on each every child of the container.

## Features

-   Lightweight and simple (0 dependencies)
-   Works with both fullpage sections (100vh) and variable height sections.
-   You can customize the snap scrolling's duration and easing presets
-   You can have as many normal scroll sections as you want.

## Inspiration

https://gist.github.com/james2doyle/5694700
https://github.com/tarun-dugar/easy-scroll
