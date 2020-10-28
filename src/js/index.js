import '../css/glideable.css'
import { glideableElements } from './elements'
import { glideableState } from './state'
import { glideableClassNames } from './attrNames'
import { getCSSValue, getWidth, setCSSValue } from './utils'
import { handleNotNumber } from './exceptions'

function Glideable({
  selector,
  minMoveToChangePosition = 100,
  cursor,
}) {
  handleNotNumber(minMoveToChangePosition)

  const state = glideableState()
  const elements = glideableElements(selector)

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
      ) / state.distanceToNext
    )
  }

  function calcDistanceMoved(pointerXCurrent) {
    return pointerXCurrent - state.pointerXOrigin
  }

  function calcCurrentPosition(pointerXCurrent) {
    const nth = -(
      calcDistanceMoved(pointerXCurrent) / state.distanceToNext
    ) + state.restingPosition
    const throttle = 0.3

    if (nth < state.positionLimitStart) {
      return nth * throttle
    }

    if (nth > state.positionLimitEnd) {
      return state.positionLimitEnd + ((nth - state.positionLimitEnd) * throttle)
    }

    return nth
  }

  function calcRestingPosition(pointerXCurrent) {
    const currentPosition = calcCurrentPosition(pointerXCurrent)
    const distanceMoved = calcDistanceMoved(pointerXCurrent)
    const threshold = minMoveToChangePosition

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
      elements.slides.classList.add(glideableClassNames.isTransitioning)
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
    event.currentTarget.classList.remove(glideableClassNames.isTransitioning)
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

  // Functions to help control the position

  function isEndPosition() {
    return state.restingPosition === state.positionLimitEnd
  }

  function isStartPosition() {
    return state.restingPosition === 0
  }

  function getCurrentPosition() {
    return state.restingPosition
  }

  function toNextPosition(nthNext, rewind, isTransitionOn) {
    if (rewind === true && isEndPosition()) {
      translateToRestingPosition(0, isTransitionOn)
    } else {
      translateToRestingPosition(
        Math.min(state.positionLimitEnd, state.restingPosition + nthNext),
        isTransitionOn,
      )
    }
  }

  function toPreviousPosition(nthPrev, rewind, isTransitionOn) {
    if (rewind === true && isStartPosition()) {
      translateToRestingPosition(state.positionLimitEnd, isTransitionOn)
    } else {
      translateToRestingPosition(Math.max(0, state.restingPosition - nthPrev), isTransitionOn)
    }
  }

  function toPosition(nth, isTransitionOn) {
    translateToRestingPosition(
      Math.min(state.positionLimitEnd, Math.max(0, nth)),
      isTransitionOn,
    )

    return this
  }

  function getNumOfSlides() {
    return elements.slides.getElementsByTagName('li').length
  }

  function getNumOfSlidesInView() {
    return Number(getCSSValue(elements.container, '--numOfSlidesInView'))
  }

  // Events

  window.addEventListener('resize', handleResize)
  elements.container.addEventListener('pointerdown', prepareForSwipingMotion)
  elements.slides.addEventListener('transitionend', handleTransitionEnd)

  prepareForMotion()

  // API

  return {
    position() {
      return getCurrentPosition()
    },

    next(nthNext = 1, rewind = true, isTransitionOn = true) {
      handleNotNumber(nthNext)
      toNextPosition(nthNext, !!rewind, !!isTransitionOn)
      return this
    },

    prev(nthPrev = 1, rewind = true, isTransitionOn = true) {
      handleNotNumber(nthPrev)
      toPreviousPosition(nthPrev, !!rewind, !!isTransitionOn)
      return this
    },

    to(nth = 0, isTransitionOn = true) {
      handleNotNumber(nth)
      toPosition(nth, !!isTransitionOn)
      return this
    },

    length() {
      return getNumOfSlides()
    },

    countInView() {
      return getNumOfSlidesInView()
    },

    countSteps() {
      return this.count() - this.countInView()
    },

    isEnd() {
      return isEndPosition()
    },

    isStart() {
      return isStartPosition()
    },
  }
}

export { Glideable }
