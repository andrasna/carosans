# Carosans

A minimalistic vanilla JS/CSS carousel.

It is currently in alpha, all feedback is welcome!

## How to include it into your project

### Install

`npm i carosans`

### Import CSS
```javascript
import 'carosans/src/css/carousel.css'
```

### Import JS
```javascript
import Carousel from 'carosans'
```

### Alternatively, without import
```html

<!DOCTYPE html>
  <head>
    <link rel="stylesheet" href="carousel.min.css">

    ...

  </head>
<body>

  ...

  <script src="carousel.min.js"></script>
  <script>
    Carousel()
  </script>
</body>
</html>
```

## How to use

### Create a single carousel

```javascript
Carousel()
```

The HTML requires the following absolutely minimum structure:

```html

<div class="carousel-outer">
  <ul class="carousel-inner">
    <li class="carousel-item">
      1
    </li>
    <li class="carousel-item">
      2...
    </li>
  </ul>
</div>
```

#### Notes:

- The class names (`carousel-outer`, `carousel-inner`, `carousel-item`) are required.
- It doesn't have to be a list with list items, you can use div's or other elements.

### Create multiple carousels

```javascript
Carousel({
  selector: '.my-custom-selector-1',
})
```

```javascript
Carousel({
  selector: '.my-custom-selector-2',
})
```

The corresponding HTML:

```html
<!--Carousel 1-->
<div class="carousel-outer my-custom-selector-1">
  <div class="carousel-inner">
    <div class="carousel-item">
      1
    </div>
    <div class="carousel-item">
      2...
    </div>
  </div>
</div>

<!--Carousel 2-->
<div class="carousel-outer my-custom-selector-2">
  <div class="carousel-inner">
    <div class="carousel-item">
      1
    </div>
    <div class="carousel-item">
      2...
    </div>
  </div>
</div>

```

## Customizing the carousel

### Options object

The `Carousel` function accepts an `options object`.

Here is an example whith all the available options:

```javascript
Carousel({
  selector: '.my-custom-selector-1',  // default: '.carousel-outer'
  minMoveToChangePosition: 50,        // default: 100
  cursor: 'grab',                     // default: 'auto'
  freeMode: true,                     // default: false
})
```

### API guide:

```javascript
const carousel = Carousel({
  selector: '.my-custom-selector-1',
})

/**
 * Get last position.
 */
carousel.pos()

/**
 * Check if it is the ending position.
 */
carousel.isEnd()

/**
 * Check if it is the starting position.
 */
carousel.isStart()

/**
 * Go to next position.
 */
carousel.next(nthNext = 1, rewind = true, isTransitionOn = true)

/**
 * Go to previous position.
 */
carousel.prev(nthPrev = 1, rewind = true, isTransitionOn = true)

/**
 * Go to nth position.
 */
carousel.to(nth = 0, isTransitionOn = true)

/**
 * Get the number of slides in the list.
 */
carousel.length()

/**
 * Get the number of slides in view.
 */
carousel.countInView()

/**
 * Show how many steps till you reach the end, if you go one step at a time.
 * Useful for pagination.
 */
carousel.countSteps()

/**
 * Get carousel elements
 */
carousel.getOuter()
carousel.getInner()
carousel.getFirst()
carousel.getNth(nth = 1)
carousel.getLast()
```
### CSS

Carosans has a minimum layer of CSS, to make the carousel work, therefore you have to include `carousel.css` into your project.

This basic CSS layer defines some `custom properties` that you can use.

Here is an example of using these predefined CSS properties:

```css
/* Carousel one */

.my-custom-selector-1 {
  --numOfItemsInView: 1;
  --portionVisibleOfExtraItem: .3;
  --gapSize: 1rem;
  --transitionDuration: .35s;
  --transitionTiming: ease;
}

@media (min-width: 50rem) {
  .my-custom-selector-1 {
    --numOfItemsInView: 3;
    --gapSize: 1.5rem;
  }
}

@media (min-width: 75rem) {
  .my-custom-selector-1 {
    --numOfItemsInView: 4;
  }
}

/* Carousel two */

.my-custom-selector-2 {
  --numOfItemsInView: 1;
  --transitionDuration: .35s;
  --transitionTiming: ease;
}

@media (min-width: 50rem) {
  .my-custom-selector-2 {
    --numOfItemsInView: 2;
  }
}

@media (min-width: 75rem) {
  .my-custom-selector-2 {
    --numOfItemsInView: 3;
  }
}
```
Check out the `examples` folder, to see how things fit together.

You can find an example on codepen:

https://codepen.io/andrasnagy/full/oNLYgZr

## Contribution

A few notes for now:

Useful commands:

`npm test`

`npm run build`

`npm run lint`

Test cases can be found in the `examples` folder.

Let me know, if you have any questions or suggestions by opening a new issue.
