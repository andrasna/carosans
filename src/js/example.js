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

Glideable({
  selector: '.three',
})
