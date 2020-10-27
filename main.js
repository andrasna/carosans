import {Glideable} from './src/js/index.js'

const a1 = Glideable({
  selector: '.one',
  cursor: 'grab',
  minMoveToChangePosition: 75,
})

const a2 = Glideable({
  selector: '.two'
})

const a3 = Glideable({
  selector: '.three'
})
