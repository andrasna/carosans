import Carosans from '../../src/js/index.js'

Carosans({
  selector: '.my-custom-selector-1',
  cursor: 'grab',
  minMoveToChangePosition: 75,
})

Carosans({
  selector: '.my-custom-selector-2',
  freeMode: true,
})

const a3 = Carosans({
  selector: '.my-custom-selector-3',
})

setInterval(() => {
  a3.next()
}, 4000)
