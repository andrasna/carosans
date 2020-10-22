import {glideableElements} from './elements.js'
import {glideableState} from './state.js'
import {glideableClassNames} from './attrNames.js'
import {getWidth, setCSSValue} from './utils.js'

function Glideable({selector}) {
  const state = glideableState()
  const elements = glideableElements(selector)

  // Events

  function prepareForSwipingMotion(event) {
    event.preventDefault()
    state.distanceToNext = calcDistanceToNext()
    state.positionLimitRight = calcPositionLimitRight()
    state.pointerXOrigin = event.clientX
    document.addEventListener('pointermove', startTranslating)
    document.addEventListener('pointerup', handlePointerUp)
  }

  function handleTransitionEnd(event) {
    event.currentTarget.classList.remove(glideableClassNames.isTransitioning)
  }

  function handleResize() {
    state.distanceToNext = calcDistanceToNext()
    state.positionLimitRight = calcPositionLimitRight()

    if (state.restingPosition < state.positionLimitRight) {
      translateToRestingPosition(state.positionLimitRight)
    }
  }

  function handlePointerUp(event) {
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
  
  function calcPositionLimitRight() {
    return(
      -(Math.abs(elements.firstSlide.getBoundingClientRect().left) +
        elements.lastSlide.getBoundingClientRect().right -
        getWidth(elements.container)
      ) / state.distanceToNext
    )
  }
  
  function calcCurrentPosition(pointerXCurrent) {
    const distanceMoved = pointerXCurrent - state.pointerXOrigin 
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
  
  function calcRestingPosition(pointerXCurrent) {
    const currentPosition = calcCurrentPosition(pointerXCurrent)
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
  
  function startTranslating(event) {
    setCSSValue(elements.container, '--position', calcCurrentPosition(event.clientX))
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
