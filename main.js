import {Glideable} from './src/js/index.js'

const a1 = Glideable({
  selector: '.one',
  cursor: 'grab',
  minMoveToChangePosition: 75,
})

console.log(a1.count())
console.log(a1.countSteps())
console.log(a1.countInView())

const a2 = Glideable({
  selector: '.two'
})

const a3 = Glideable({
  selector: '.three'
})
