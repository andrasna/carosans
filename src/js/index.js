import {glideableElements} from './elements.js'
import {glideableState} from './state.js'
import {glideableClassNames} from './attrNames.js'
import {getCSSValue, getWidth, setCSSValue} from './utils.js'

function Glideable({
    selector,
    minMoveToChangePosition = 100,
    cursor = '',
  }) {
  const state = glideableState()
  const elements = glideableElements(selector)

  // Handlers

  function prepareForMotion() {
    if (cursor === 'grab') {
      elements.container.style.cursor = 'grab'
    }
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

  function handleTransitionEnd(event) {
    event.currentTarget.classList.remove(glideableClassNames.isTransitioning)
  }

  function handleResize() {
    prepareForMotion()

    if (state.restingPosition > state.positionLimitEnd) {
      translateToRestingPosition(state.positionLimitEnd)
    }
  }

  function handlePointerUp(event) {
    setCursorStyle(false)
    translateToRestingPosition(calcRestingPosition(event.clientX))
    document.removeEventListener('pointermove', startTranslating)
    document.removeEventListener('pointerup', handlePointerUp)
  }

  // Calculations

  function calcDistanceToNext() {
    return (
      elements.secondSlide.getBoundingClientRect().left -
      elements.firstSlide.getBoundingClientRect().left
    )
  }

  function calcPositionLimitEnd() {
    return(
      (Math.abs(elements.firstSlide.getBoundingClientRect().left) +
        elements.lastSlide.getBoundingClientRect().right -
        getWidth(elements.container)
      ) / state.distanceToNext
    )
  }

  function calcDistanceMoved(pointerXCurrent) {
    return pointerXCurrent - state.pointerXOrigin 
  }

  function calcCurrentPosition(pointerXCurrent) {
    const position = -(calcDistanceMoved(pointerXCurrent) / state.distanceToNext) + state.restingPosition
    const throttle = .3
  
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
  }

  // Cursor style 

  function setCursorStyle(isTranslating) {
    switch(cursor) {
      case 'grab':
        isTranslating ?
        elements.container.style.cursor = 'grabbing' :
        elements.container.style.cursor = 'grab'
      break
    }
  }

  // Translate Position

  function translateToRestingPosition(position) {
    elements.slides.classList.add(glideableClassNames.isTransitioning)
    setCSSValue(elements.container, '--position', position)
    state.restingPosition = position
  }
  
  function startTranslating(event) {
    setCursorStyle(true)
    setCSSValue(elements.container, '--position', calcCurrentPosition(event.clientX))
  }

  // Controls

  function getCurrentPosition() {
    return state.restingPosition
  }

  function toNextPosition() {
    translateToRestingPosition(Math.min(state.positionLimitEnd, state.restingPosition + 1))
  }

  function toPreviousPosition() {
    translateToRestingPosition(Math.max(0, state.restingPosition - 1))
  }

  function toPosition(position) {
    if (isNaN(position)) {
      throw new Error('Position must be a number.')
    }

    translateToRestingPosition(Math.min(state.positionLimitEnd, Math.max(0, Number(position))))
  }

  function getNumOfSlides() {
    return elements.slides.getElementsByTagName('li').length
  }

  function numOfSlidesInView() {
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

    next() {
      toNextPosition()
      return this
    },

    prev() {
      toPreviousPosition()
      return this
    },

    to(pos = 0) {
      toPosition(pos)
      return this
    },

    count() {
      return getNumOfSlides()
    },

    countInView() {
      return numOfSlidesInView()
    },

    countSteps() {
      return this.count() - this.countInView()
    },
  }
}

export {Glideable}