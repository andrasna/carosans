import { getCarouselElements } from './elements.js'
import { createDefaultStateObj } from './defaultState.js'
import { carouselClassNames } from './attrNames.js'
import { getCSSValue, getWidth, setCSSValue } from './utils.js'
import { handleNotNumber } from './exceptions.js'
import { createDefaultOptsObj } from './defaultOpts.js'

function Carousel(userOpts = {}) {
  const opts = {
    ...createDefaultOptsObj(),
    ...userOpts,
  }
  const elements = getCarouselElements(opts.selector)
  const state = createDefaultStateObj()

  /**
   * Cursor style
   */

  function setCursorStyle(isTranslating) {
    switch (opts.cursor) {
      case 'grab':
        if (isTranslating === true) {
          elements.outer.style.cursor = 'grabbing'
        } else {
          elements.outer.style.cursor = 'grab'
        }
        break

      // no default
    }
  }

  /**
   * Calculations
   */

  function calcDistanceToNext() {
    return (
      elements.getNthItem(2).getBoundingClientRect().left
      - elements.getNthItem(1).getBoundingClientRect().left
    )
  }

  function calcPositionLimitEnd() {
    return (
      (Math.abs(elements.getNthItem(1).getBoundingClientRect().left)
        + elements.lastItem.getBoundingClientRect().right
        - getWidth(elements.outer)
      ) / Math.max(1, state.distanceToNext)
    )
  }

  function calcDistanceMoved(pointerXCurrent) {
    return pointerXCurrent - state.pointerXOrigin
  }

  function calcCurrentPosition(pointerXCurrent) {
    const position = -(calcDistanceMoved(pointerXCurrent) / state.distanceToNext)
      + state.restingPosition

    const throttle = 0.3

    if (position < state.positionLimitStart) {
      return position * throttle
    }

    if (position > state.positionLimitEnd) {
      return state.positionLimitEnd + ((position - state.positionLimitEnd) * throttle)
    }

    return position
  }

  function calcRestingPosition(pointerXCurrent) {
    const currentPosition = calcCurrentPosition(pointerXCurrent)
    const distanceMoved = calcDistanceMoved(pointerXCurrent)
    const threshold = opts.minMoveToChangePosition

    if (opts.freeMode === true && distanceMoved < 0) {
      return Math.min(state.positionLimitEnd, currentPosition + 0.05)
    }

    if (opts.freeMode === true && distanceMoved > 0) {
      return Math.max(0, currentPosition - 0.05)
    }

    if (Math.abs(distanceMoved) < threshold) {
      return state.restingPosition
    }

    if (currentPosition < state.positionLimitStart) {
      return state.positionLimitStart
    }

    if (currentPosition > state.positionLimitEnd) {
      return state.positionLimitEnd
    }

    if (distanceMoved < 0) {
      return Math.min(state.positionLimitEnd, (Math.ceil(currentPosition)))
    }

    if (distanceMoved > 0) {
      return Math.floor(currentPosition)
    }

    throw new Error(
      'Function should have returned a number at this point.',
    )
  }

  /**
   * Translate Position
   */

  function translateToRestingPosition(nth, isTransitionOn = true) {
    if (isTransitionOn === true) {
      elements.inner.classList.add(carouselClassNames.isTransitioning)
    }

    setCSSValue(elements.outer, '--position', nth)
    state.restingPosition = nth
  }

  function startTranslating(event) {
    setCursorStyle(true)
    setCSSValue(elements.outer, '--position', calcCurrentPosition(event.clientX))
  }

  /**
   * Handlers
   */

  function handleTransitionEnd(event) {
    event.currentTarget.classList.remove(carouselClassNames.isTransitioning)
  }

  function handlePointerUp(event) {
    setCursorStyle(false)
    translateToRestingPosition(calcRestingPosition(event.clientX))

    document.removeEventListener('pointermove', startTranslating)
    document.removeEventListener('pointerup', handlePointerUp)
  }

  function prepareForMotion() {
    setCursorStyle(false)
    state.distanceToNext = calcDistanceToNext()
    state.positionLimitEnd = calcPositionLimitEnd()
  }

  function prepareForSwipingMotion(event) {
    event.preventDefault()
    prepareForMotion()
    state.pointerXOrigin = event.clientX

    // Events

    document.addEventListener('pointermove', startTranslating)
    document.addEventListener('pointerup', handlePointerUp)
  }

  function handleResize() {
    prepareForMotion()

    if (state.restingPosition > state.positionLimitEnd) {
      translateToRestingPosition(state.positionLimitEnd)
    }
  }

  /**
   * Events
   */

  window.addEventListener('resize', handleResize)
  elements.outer.addEventListener('pointerdown', prepareForSwipingMotion)
  elements.inner.addEventListener('transitionend', handleTransitionEnd)
  prepareForMotion()

  /**
   * API
   */

  return {
    /**
     * Get last position.
     *
     * @return {number}
     */

    pos() {
      return state.restingPosition
    },

    /**
     * Check if it is the ending position.
     *
     * @return {boolean}
     */

    isEnd() {
      return state.restingPosition === state.positionLimitEnd
    },

    /**
     * Check if it is the starting position.
     *
     * @return {boolean}
     */

    isStart() {
      return state.restingPosition === 0
    },

    /**
     * Go to next position.
     *
     * @param {number} [nthNext=1] - The nth next position to go to.
     * @param {boolean} [rewind=true] - Back to starting position, if it is at the ending position.
     * @param {boolean} [isTransitionOn=true] - Transition when position changes.
     * @return {object} - this
     */

    next(nthNext = 1, rewind = true, isTransitionOn = true) {
      handleNotNumber(nthNext)

      if (rewind === true && this.isEnd()) {
        translateToRestingPosition(0, !!isTransitionOn)
      } else {
        translateToRestingPosition(
          Math.min(state.positionLimitEnd, state.restingPosition + nthNext),
          !!isTransitionOn,
        )
      }

      return this
    },

    /**
     * Go to previous position.
     *
     * @param {number} [nthPrev=1] - The nth previous position to go to.
     * @param {boolean} [rewind=true] - Back to ending position, if it is at the starting position.
     * @param {boolean} [isTransitionOn=true] - Transition when position changes.
     * @return {object} - this
     */

    prev(nthPrev = 1, rewind = true, isTransitionOn = true) {
      handleNotNumber(nthPrev)

      if (rewind === true && this.isStart()) {
        translateToRestingPosition(state.positionLimitEnd, !!isTransitionOn)
      } else {
        translateToRestingPosition(Math.max(0, state.restingPosition - nthPrev), !!isTransitionOn)
      }

      return this
    },

    /**
     * Go to nth position.
     *
     * @param {number} [nth=0] - The nth position to go to.
     * @param {boolean} [isTransitionOn=true] - Transition when position changes.
     * @return {object} - this
     */

    to(nth = 0, isTransitionOn = true) {
      handleNotNumber(nth)

      translateToRestingPosition(
        Math.min(state.positionLimitEnd, Math.max(0, nth)),
        !!isTransitionOn,
      )

      return this
    },

    /**
     * Get the number of items in the list.
     *
     * @return {number}
     */

    length() {
      return elements.inner.getElementsByTagName('li').length
    },

    /**
     * Get the number of items in view.
     *
     * @return {number}
     */

    countInView() {
      return Number(getCSSValue(elements.outer, '--numOfItemsInView'))
    },

    /**
     * Show how many steps till you reach the end, if you go one step at a time.
     * Useful for pagination.
     *
     * @return {number}
     */

    countSteps() {
      return this.length() - this.countInView()
    },

    /**
     * Get carousel elements.
     */

    getOuter() {
      return elements.outer
    },

    getInner() {
      return elements.inner
    },

    getFirst() {
      return elements.firstItem
    },

    getNth(nth) {
      return elements.getNthItem(nth)
    },

    getLast() {
      return elements.lastItem
    },
  }
}

export default Carousel
