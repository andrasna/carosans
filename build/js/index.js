(() => {
  // src/js/elements.js
  function glideableElements(selector) {
    return {
      get container() {
        return document.querySelector(selector);
      },
      get slides() {
        return this.container.querySelector("ul:first-child");
      },
      get firstSlide() {
        return this.container.querySelector("li:first-child");
      },
      get secondSlide() {
        return this.container.querySelector("li:nth-child(2)");
      },
      get lastSlide() {
        return this.container.querySelector("li:last-child");
      }
    };
  }

  // src/js/state.js
  function glideableState() {
    return {
      pointerMoveOrigin: 0,
      restingPosition: 0,
      distanceToNext: 0,
      positionLimitLeft: 0,
      positionLimitRight: 0
    };
  }

  // src/js/attrNames.js
  const glideableClassNames = {
    isTransitioning: "is-transitioning"
  };

  // src/js/utils.js
  function getWidth(el) {
    return el.clientWidth;
  }
  function setCSSValue(el, prop, val) {
    el.style.setProperty(prop, val);
  }

  // src/js/index.js
  function Glideable({selector}) {
    const state2 = glideableState();
    const elements2 = glideableElements(selector);
    function prepareForSwipingMotion(e) {
      e.preventDefault();
      state2.distanceToNext = calcDistanceToNext();
      state2.positionLimitRight = calcPositionLimitRight();
      state2.pointerMoveOrigin = e.clientX;
      document.addEventListener("pointermove", startTranslating);
      document.addEventListener("pointerup", handlePointerUp);
    }
    function handleTransitionEnd(e) {
      e.currentTarget.classList.remove(glideableClassNames.isTransitioning);
    }
    function handleResize() {
      state2.distanceToNext = calcDistanceToNext();
      state2.positionLimitRight = calcPositionLimitRight();
      if (state2.restingPosition < state2.positionLimitRight) {
        translateToRestingPosition(state2.positionLimitRight);
      }
    }
    function handlePointerUp(e) {
      translateToRestingPosition(calcRestingPosition(e.clientX));
      document.removeEventListener("pointermove", startTranslating);
      document.removeEventListener("pointerup", handlePointerUp);
    }
    function calcDistanceToNext() {
      return elements2.secondSlide.getBoundingClientRect().left - elements2.firstSlide.getBoundingClientRect().left;
    }
    function calcPositionLimitRight() {
      return -(Math.abs(elements2.firstSlide.getBoundingClientRect().left) + elements2.lastSlide.getBoundingClientRect().right - getWidth(elements2.container)) / state2.distanceToNext;
    }
    function calcCurrentPosition(pointerCurrent) {
      const distanceMoved = pointerCurrent - state2.pointerMoveOrigin;
      const position = distanceMoved / state2.distanceToNext + state2.restingPosition;
      const throttle = 0.3;
      if (position > state2.positionLimitLeft) {
        return position * throttle;
      }
      if (position < state2.positionLimitRight) {
        return state2.positionLimitRight + (position - state2.positionLimitRight) * throttle;
      }
      return position;
    }
    function calcRestingPosition(pointerCurrent) {
      const currentPosition = calcCurrentPosition(pointerCurrent);
      const diff = state2.restingPosition - currentPosition;
      const threshold = 0.3;
      if (Math.abs(diff) < threshold) {
        return state2.restingPosition;
      }
      if (currentPosition > state2.positionLimitLeft) {
        return state2.positionLimitLeft;
      }
      if (currentPosition < state2.positionLimitRight) {
        return state2.positionLimitRight;
      }
      if (diff > 0) {
        return Math.max(state2.positionLimitRight, Math.floor(currentPosition));
      }
      if (diff < 0) {
        return Math.ceil(currentPosition);
      }
    }
    function translateToRestingPosition(position) {
      elements2.slides.classList.add(glideableClassNames.isTransitioning);
      setCSSValue(elements2.container, "--position", position);
      state2.restingPosition = position;
    }
    function startTranslating(e) {
      setCSSValue(elements2.container, "--position", calcCurrentPosition(e.clientX));
    }
    window.addEventListener("resize", handleResize);
    elements2.container.addEventListener("pointerdown", prepareForSwipingMotion);
    elements2.slides.addEventListener("transitionend", handleTransitionEnd);
  }
  Glideable({
    selector: ".one"
  });
  Glideable({
    selector: ".two"
  });
})();
