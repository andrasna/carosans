import Carousel from '../../src/js/index.js'

Carousel({
  selector: '.my-custom-selector-1',
  cursor: 'grab',
  minMoveToChangePosition: 75,
})

Carousel({
  selector: '.my-custom-selector-2',
  freeMode: true,
})

const a3 = Carousel({
  selector: '.my-custom-selector-3',
})

setInterval(() => {
  a3.next()
}, 4000)
