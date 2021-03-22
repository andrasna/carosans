import Carousel from '../../src/js/index.js'

const carousel1 = Carousel({
  selector: '.my-custom-selector-1',
  minMoveToChangePosition: 75,
})

function myPlugin() {
  // Do something
}

carousel1.register(myPlugin)

Carousel({
  selector: '.my-custom-selector-2',
})

Carousel({
  selector: '.my-custom-selector-3',
})
