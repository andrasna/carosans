import { carouselClassNames } from './attrNames.js'
import { handleNullFromSelector } from './exceptions.js'

export function getCarouselElements(selector) {
  const outer = document.querySelector(selector)

  handleNullFromSelector(outer)

  return {
    get outer() {
      return outer
    },

    get inner() {
      return outer.querySelector(`.${carouselClassNames.inner}`)
    },

    get firstItem() {
      return outer.querySelector(`.${carouselClassNames.item}:first-child`)
    },

    get lastItem() {
      return outer.querySelector(`.${carouselClassNames.item}:last-child`)
    },

    getNthItem(nth = 1) {
      return outer.querySelector(`.${carouselClassNames.item}:nth-child(${nth})`)
    },
  }
}
