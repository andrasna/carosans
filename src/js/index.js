import { getCarouselElements } from './elements.js'
import { createDefaultStateObj } from './defaultState.js'
import { carouselClassNames } from './attrNames.js'
import { getWidth, setCSSValue } from './utils.js'
import { createDefaultOptsObj } from './defaultOpts.js'

function Carousel(userOpts = {}) {
  const opts = {
    ...createDefaultOptsObj(),
    ...userOpts,
  }
  const elements = getCarouselElements(opts.selector)
  const state = createDefaultStateObj()

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

  function translateToRestingPosition(nth, isTransitionOn = true) {
    if (isTransitionOn === true) {
      elements.inner.classList.add(carouselClassNames.isTransitioning)
    }

    setCSSValue(elements.outer, '--position', nth)
    state.restingPosition = nth
  }

  function startTranslating(event) {
    setCSSValue(elements.outer, '--position', calcCurrentPosition(event.clientX))
  }

  function handleTransitionEnd(event) {
    event.currentTarget.classList.remove(carouselClassNames.isTransitioning)
  }

  function handlePointerUp(event) {
    translateToRestingPosition(calcRestingPosition(event.clientX))

    document.removeEventListener('pointermove', startTranslating)
    document.removeEventListener('pointerup', handlePointerUp)
  }

  function prepareForMotion() {
    state.distanceToNext = calcDistanceToNext()
    state.positionLimitEnd = calcPositionLimitEnd()
  }

  function prepareForSwipingMotion(event) {
    event.preventDefault()
    prepareForMotion()
    state.pointerXOrigin = event.clientX
    document.addEventListener('pointermove', startTranslating)
    document.addEventListener('pointerup', handlePointerUp)
  }

  function handleResize() {
    prepareForMotion()

    if (state.restingPosition > state.positionLimitEnd) {
      translateToRestingPosition(state.positionLimitEnd)
    }
  }

  elements.outer.style.overflow = 'hidden'
  window.addEventListener('resize', handleResize)
  elements.outer.addEventListener('pointerdown', prepareForSwipingMotion)
  elements.inner.addEventListener('transitionend', handleTransitionEnd)
  prepareForMotion()

  return {
    elements,
    state,
    opts,
    register(plugin) {
      plugin.call(this)
    },
  }
}

export default Carousel
