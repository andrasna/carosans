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
  explicitInit = false,
}) {
  handleNotNumber(minMoveToChangePosition)

  const state = carosansState()
  const elements = carosansElements(selector)

  // Cursor style

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

  // Calculations

  function calcDistanceToNext() {
    return (
      elements.secondSlide.getBoundingClientRect().left
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

  // Translate Position

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

  // Events

  window.addEventListener('resize', handleResize)
  elements.container.addEventListener('pointerdown', prepareForSwipingMotion)
  elements.slides.addEventListener('transitionend', handleTransitionEnd)

  // The default is false. Automatically call init, when calling Carosans.
  if (explicitInit === false) {
    prepareForMotion()
  }

  // API

  return {
    // Get last position
    pos() {
      return state.restingPosition
    },

    // Check if it is the ending position
    isEnd() {
      return state.restingPosition === state.positionLimitEnd
    },

    // Check if it is the starting position
    isStart() {
      return state.restingPosition === 0
    },

    // Go to next position
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

    // Go to previous position
    prev(nthPrev = 1, rewind = true, isTransitionOn = true) {
      handleNotNumber(nthPrev)

      if (rewind === true && this.isStart()) {
        translateToRestingPosition(state.positionLimitEnd, !!isTransitionOn)
      } else {
        translateToRestingPosition(Math.max(0, state.restingPosition - nthPrev), !!isTransitionOn)
      }

      return this
    },

    // Go to nth position
    to(nth = 0, isTransitionOn = true) {
      handleNotNumber(nth)

      translateToRestingPosition(
        Math.min(state.positionLimitEnd, Math.max(0, nth)),
        !!isTransitionOn,
      )

      return this
    },

    // Get the number of slides
    length() {
      return elements.slides.getElementsByTagName('li').length
    },

    // Get the number of slides in view
    countInView() {
      return Number(getCSSValue(elements.container, '--numOfSlidesInView'))
    },

    // Returns a number - if you go one step at a time, how many steps till you reach the end.
    countSteps() {
      return this.length() - this.countInView()
    },

    // Only needed, if the value of explicitInit is true (default is false).
    init() {
      prepareForMotion()
    },
  }
}

export { Carosans }
