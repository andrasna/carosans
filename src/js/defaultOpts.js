import { carouselClassNames } from './attrNames.js'

export function createDefaultOptsObj() {
  return {
    selector: `.${carouselClassNames.outer}`,
    minMoveToChangePosition: 100,
  }
}
