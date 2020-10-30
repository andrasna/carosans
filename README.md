# Carosans

A work in progress.

~~Carosans is a minimalistic carousel, it is currently in alpha, feedback is welcome!~~ - not just yet.

## ~~Installation~~

~~`npm i carosans`~~

## ~~Import CSS~~
```javascript
import 'carosans/src/css/carosans.css'
```
or
```javascript
import 'carosans/build/css/carosans.min.css'
```
## ~~Import JS~~
```javascript
import Carosans from 'carosans'
```

## Create a single carousel

```javascript
Carosans({
  selector: '.carosans',
})
```

The HTML requires the following absolutely minimum structure:

```html
<div class="carosans">
  <ul>
    <li>
      1 
    </li>
    <li>
      2...
    </li>
    <li>
  </ul>
</div>
```

#### As you can see:

1. It has to be a list inside a `div`. Why does it have to be a list? I think if a carousel inherently represents a list of things, then it makes sense to assume this structure. Just let me know if you have different requirements, I don't necessarily want to enforce this rule.
1. The div has to have the `carosans` class. This is for the CSS. For the JS, you have to specify a selector, which could be \'`.carosans`\`, but it doesn't have to be.

## Create multiple independent carousels

```javascript
Carosans({
  selector: '.my-custom-selector-1',
})
```

```javascript
Carosans({
  selector: '.my-custom-selector-2',
})
```

The corresponding HTML:

```html

<!--Carousel 1-->
<div class="carosans .my-custom-selector-1">
  <ul>
    <li>
      1 
    </li>
    <li>
      2...
    </li>
    <li>
  </ul>
</div>


<!--Carousel 2-->
<div class="carosans .my-custom-selector-2">
  <ul>
    <li>
      1 
    </li>
    <li>
      2...
    </li>
    <li>
  </ul>
</div>
```

## Customizing the carousel

### Options object

The `Carosans` function accepts an `options object` when a carousel instance is created.

For example:

```javascript
Carosans({
  selector: '.carosans',        // required, no default
  minMoveToChangePosition: 50,  // default: 100
  cursor: 'grab',               // default: your cursor 
  freeMode: true,               // default: false
})
```

### API guide:

```javascript
const a1 = Carosans({
  selector: '.my-custom-selector-1',
})

/**
 * Get last position.
 */
a1.pos()

/**
 * Check if it is the ending position.
 */
a1.isEnd()

/**
 * Check if it is the starting position.
 */
a1.isStart()

/**
 * Go to next position.
 */
a1.next()

/**
 * Go to previous position.
 */
a1.prev()

/**
 * Go to nth position.
 */
a1.to()

/**
 * Get the number of slides in the list.
 */
a1.length()

/**
 * Get the number of slides in view.
 */
a1.countInView()

/**
 * Show how many steps till you reach the end, if you go one step at a time.
 * Useful for pagination.
 */
a1.countSteps()

/**
 * Get carousel elements 
 */
a1.getContainer()

a1.getSlides()

a1.getFirst()

a1.getSecond()

a1.getLast()
```

### CSS

Carosans has a minimum layer of CSS, to make the carousel work, therefore you have to include `carosans.css` into your project.

This basic CSS layer defines some `custom properties` that you can use.

Here is an example of using these predefined CSS properties:

```css

/* Carousel one */

.my-custom-selector-1 {
  --numOfSlidesInView: 1;
  --endSlideVis: .3;
  --gapSize: 1rem;
  --transitionDuration: .35s;
  --transitionTiming: ease;
}

@media (min-width: 50rem) {
  .my-custom-selector-1 {
    --numOfSlidesInView: 3;
    --gapSize: 1.5rem;
  }
}

@media (min-width: 75rem) {
  .my-custom-selector-1 {
    --numOfSlidesInView: 4;
  }
}

/* Carousel two */

.my-custom-selector-2 {
  --numOfSlidesInView: 1;
  --transitionDuration: .35s;
  --transitionTiming: ease;
}

@media (min-width: 50rem) {
  .my-custom-selector-2 {
    --numOfSlidesInView: 2;
  }
}

@media (min-width: 75rem) {
  .my-custom-selector-2 {
    --numOfSlidesInView: 3;
  }
}
```

Check out the `examples` folder, to see how things fit together.

You can find a first prototype on codepen:

https://codepen.io/andrasnagy/pen/oNLYgZr

## Contribution

A few notes for now:

Useful commands:

`npm test`

`npm run build`

`npm run lint`

Test cases can be found in the `examples` folder.

Let me know, if you have any questions or suggestions. You can open an issue.
