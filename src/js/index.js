import {glideableElements} from './elements.js'
import {glideableState} from './state.js'
import {glideableClassNames} from './attrNames.js'
import {getWidth, setCSSValue} from './utils.js'

function Glideable(selector) {
  const state = glideableState()
  const elements = glideableElements(selector)

  // Events

  function prepareForSwipingMotion(e) {
    e.preventDefault()
    state.distanceToNext = calcDistanceToNext()
    state.positionLimitRight = calcPositionLimitRight()
    state.pointerMoveOrigin = e.clientX
    document.addEventListener('pointermove', startTranslating)
    document.addEventListener('pointerup', handlePointerUp)
  }

  function handleTransitionEnd(e) {
    e.currentTarget.classList.remove(glideableClassNames.isTransitioning)
  }

  function handleResize() {
    state.distanceToNext = calcDistanceToNext()
    state.positionLimitRight = calcPositionLimitRight()

    if (state.restingPosition < state.positionLimitRight) {
      translateToRestingPosition(state.positionLimitRight)
    }
  }

  function handlePointerUp(e) {
    translateToRestingPosition(calcRestingPosition(e.clientX))
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
  
  function calcPositionLimitRight() {
    return(
      -(Math.abs(elements.firstSlide.getBoundingClientRect().left) +
        elements.lastSlide.getBoundingClientRect().right -
        getWidth(elements.container)
      ) / state.distanceToNext
    )
  }
  
  function calcCurrentPosition(pointerCurrent) {
    const distanceMoved = pointerCurrent - state.pointerMoveOrigin 
    const position = (distanceMoved / state.distanceToNext) + state.restingPosition
    const throttle = .3
  
    if (position > state.positionLimitLeft) {
      return position * throttle
    }
    
    if (position < state.positionLimitRight) {
      return state.positionLimitRight + ((position - state.positionLimitRight) * throttle)
    }

    return position 
  }
  
  function calcRestingPosition(pointerCurrent) {
    const currentPosition = calcCurrentPosition(pointerCurrent)
    const diff = state.restingPosition - currentPosition 
    const threshold = .3
  
    if (Math.abs(diff) < threshold) {
      return state.restingPosition
    }
    
    if (currentPosition > state.positionLimitLeft) {
      return state.positionLimitLeft
    }
    
    if (currentPosition < state.positionLimitRight) {
      return state.positionLimitRight
    } 
    
    if (diff > 0) {
      return Math.max(state.positionLimitRight, (Math.floor(currentPosition)))
    }

    if (diff < 0) {
      return Math.ceil(currentPosition)
    }
  }

  // Translate Position

  function translateToRestingPosition(position) {
    elements.slides.classList.add(glideableClassNames.isTransitioning)
    setCSSValue(elements.container, '--position', position)
    state.restingPosition = position
  }
  
  function startTranslating(e) {
    setCSSValue(elements.container, '--position', calcCurrentPosition(e.clientX))
  }

  window.addEventListener('resize', handleResize)
  elements.container.addEventListener('pointerdown', prepareForSwipingMotion)
  elements.slides.addEventListener('transitionend', handleTransitionEnd)
}

Glideable({
  selector: '.one'
})

Glideable({
  selector: '.two'
})
