import { carosansElements } from './elements.js'
import { carosansState } from './state.js'
import { carosansClassNames } from './attrNames.js'
import { getCSSValue, getWidth, setCSSValue } from './utils.js'
import { handleNotNumber } from './exceptions.js'

function Carosans({
  selector,
  minMoveToChangePosition = 100,
  cursor,
  freeMode = false,
  explicitPrepare = false,
}) {
  handleNotNumber(minMoveToChangePosition)

  const state = carosansState()
  const elements = carosansElements(selector)

  /**
   * Cursor style
   */

  function setCursorStyle(isTranslating) {
    switch (cursor) {
      case 'grab':
        if (isTranslating === true) {
          elements.container.style.cursor = 'grabbing'
        } else {
          elements.container.style.cursor = 'grab'
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
      elements.getNthSlide(2).getBoundingClientRect().left
      - elements.firstSlide.getBoundingClientRect().left
    )
  }

  function calcPositionLimitEnd() {
    return (
      (Math.abs(elements.firstSlide.getBoundingClientRect().left)
        + elements.lastSlide.getBoundingClientRect().right
        - getWidth(elements.container)
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
    const threshold = minMoveToChangePosition

    if (freeMode === true && distanceMoved < 0) {
      return Math.min(state.positionLimitEnd, currentPosition + 0.05)
    }

    if (freeMode === true && distanceMoved > 0) {
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
      'Function should have already returned a number at this point.',
    )
  }

  /**
   * Translate Position
   */

  function translateToRestingPosition(nth, isTransitionOn = true) {
    if (isTransitionOn === true) {
      elements.slides.classList.add(carosansClassNames.isTransitioning)
    }

    setCSSValue(elements.container, '--position', nth)
    state.restingPosition = nth
  }

  function startTranslating(event) {
    setCursorStyle(true)
    setCSSValue(elements.container, '--position', calcCurrentPosition(event.clientX))
  }

  // Handlers

  function handleTransitionEnd(event) {
    event.currentTarget.classList.remove(carosansClassNames.isTransitioning)
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
  elements.container.addEventListener('pointerdown', prepareForSwipingMotion)
  elements.slides.addEventListener('transitionend', handleTransitionEnd)

  /**
   * explicitPrepare is false by default, therefore prepareForMotion is called
   * automatically when calling Carosans.
   */

  if (explicitPrepare === false) {
    prepareForMotion()
  }

  // API

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
     * Get the number of slides in the list.
     *
     * @return {number}
     */

    length() {
      return elements.slides.getElementsByTagName('li').length
    },

    /**
     * Get the number of slides in view.
     *
     * @return {number}
     */

    countInView() {
      return Number(getCSSValue(elements.container, '--numOfSlidesInView'))
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
     * Only needed or useful, if the value of explicitPrepare is true (default is false).
     */

    prep() {
      prepareForMotion()
    },

    /**
     * Get carousel elements.
     */

    getContainer() {
      return elements.container
    },

    getSlides() {
      return elements.slides
    },

    getFirst() {
      return elements.firstSlide
    },

    getNth(nth) {
      return elements.getNthSlide(nth)
    },

    getLast() {
      return elements.firstSlide
    },
  }
}

export default Carosans
