import '../css/glideable.css'
import { glideableElements } from './elements'
import { glideableState } from './state'
import { glideableClassNames } from './attrNames'
import { getCSSValue, getWidth, setCSSValue } from './utils'

function Glideable({
  selector,
  minMoveToChangePosition = 100,
  cursor = '',
}) {
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
    const position = -(
      calcDistanceMoved(pointerXCurrent) / state.distanceToNext
    ) + state.restingPosition
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

    return false
  }

  // Translate Position

  function translateToRestingPosition(position, transition = true) {
    if (transition === true) {
      elements.slides.classList.add(glideableClassNames.isTransitioning)
    }

    setCSSValue(elements.container, '--position', position)
    state.restingPosition = position
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

  // Controls

  function getCurrentPosition() {
    return state.restingPosition
  }

  function toNextPosition(transition) {
    translateToRestingPosition(
      Math.min(state.positionLimitEnd, state.restingPosition + 1),
      transition,
    )
  }

  function toPreviousPosition(transition) {
    translateToRestingPosition(Math.max(0, state.restingPosition - 1), transition)
  }

  function toPosition(position, transition) {
    if (Number.isNaN(position)) {
      throw new Error('Position must be a number.')
    }

    translateToRestingPosition(
      Math.min(state.positionLimitEnd, Math.max(0, Number(position))),
      transition,
    )
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
    pos() {
      return getCurrentPosition()
    },

    next(transition) {
      toNextPosition(transition)
      return this
    },

    prev(transition) {
      toPreviousPosition(transition)
      return this
    },

    to(pos = 0, transition) {
      toPosition(pos, transition)
      return this
    },

    count() {
      return getNumOfSlides()
    },

    countInView() {
      return getNumOfSlidesInView()
    },

    countSteps() {
      return this.count() - this.countInView()
    },
  }
}

export { Glideable }
