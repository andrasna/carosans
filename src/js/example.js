import '../css/glideable.css'
import '../css/example.css'
import { Glideable } from './index'

Glideable({
  selector: '.one',
  cursor: 'grab',
  minMoveToChangePosition: 75,
})

Glideable({
  selector: '.two',
  freeMode: true,
})

const g1 = Glideable({
  selector: '.three',
})

setInterval(() => {
  g1.next()
}, 4000)
