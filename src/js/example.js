import '../css/example.css'
import { Glideable } from './index'

const a1 = Glideable({
  selector: '.one',
  cursor: 'grab',
  minMoveToChangePosition: 75,
})

setInterval(() => {
  a1.next()
}, 2000)

Glideable({
  selector: '.two',
  freeMode: true,
}).next()

Glideable({
  selector: '.three',
}).to(99)
