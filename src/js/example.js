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
})

const a3 = Glideable({
  selector: '.three',
})

setInterval(() => {
  a3.next()
}, 4000)
