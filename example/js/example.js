import { Carosans } from '../../src/js/index.js'

Carosans({
  selector: '.one',
  cursor: 'grab',
  minMoveToChangePosition: 75,
})

Carosans({
  selector: '.two',
  freeMode: true,
})

const a3 = Carosans({
  selector: '.three',
})

setInterval(() => {
  a3.next()
}, 4000)
