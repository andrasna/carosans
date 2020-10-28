(()=>{"use strict";const t="glideable-transitioning";function i(t,i,n){t.style.setProperty(i,n)}function n(t){if("number"!=typeof t)throw new Error("Expected a number, instead the input was: "+t)}function e({selector:e,minMoveToChangePosition:o=100,cursor:r=""}){n(o);const s={pointerXOrigin:0,restingPosition:0,distanceToNext:0,positionLimitStart:0,positionLimitEnd:0},c=function(t){const i=document.querySelector(t);if(null===i)throw new Error("Selector did not match.");return{get container(){return i},get slides(){return i.querySelector("ul:first-child")},get firstSlide(){return i.querySelector("li:first-child")},get secondSlide(){return i.querySelector("li:nth-child(2)")},get lastSlide(){return i.querySelector("li:last-child")}}}(e);function u(t){switch(r){case"grab":c.container.style.cursor=!0===t?"grabbing":"grab"}}function d(t){return t-s.pointerXOrigin}function a(t){const i=-d(t)/s.distanceToNext+s.restingPosition;return i<s.positionLimitStart?.3*i:i>s.positionLimitEnd?s.positionLimitEnd+.3*(i-s.positionLimitEnd):i}function l(n,e=!0){!0===e&&c.slides.classList.add(t),i(c.container,"--position",n),s.restingPosition=n}function m(t){u(!0),i(c.container,"--position",a(t.clientX))}function g(t){u(!1),l(function(t){const i=a(t),n=d(t),e=o;if(Math.abs(n)<e)return s.restingPosition;if(i<s.positionLimitStart)return s.positionLimitStart;if(i>s.positionLimitEnd)return s.positionLimitEnd;if(n<0)return Math.min(s.positionLimitEnd,Math.ceil(i));if(n>0)return Math.floor(i);throw new Error("Function should have returned a value.")}(t.clientX)),document.removeEventListener("pointermove",m),document.removeEventListener("pointerup",g)}function p(){u(!1),s.distanceToNext=c.secondSlide.getBoundingClientRect().left-c.firstSlide.getBoundingClientRect().left,s.positionLimitEnd=(Math.abs(c.firstSlide.getBoundingClientRect().left)+c.lastSlide.getBoundingClientRect().right-c.container.clientWidth)/s.distanceToNext}function f(){return s.restingPosition===s.positionLimitEnd}function h(){return 0===s.restingPosition}return window.addEventListener("resize",(function(){p(),s.restingPosition>s.positionLimitEnd&&l(s.positionLimitEnd)})),c.container.addEventListener("pointerdown",(function(t){t.preventDefault(),p(),s.pointerXOrigin=t.clientX,document.addEventListener("pointermove",m),document.addEventListener("pointerup",g)})),c.slides.addEventListener("transitionend",(function(i){i.currentTarget.classList.remove(t)})),p(),{position:()=>s.restingPosition,next(t=1,i=!0,e=!0){return function(t,i,e){n(t),e=Boolean(e),!0===i&&f()?l(0,e):l(Math.min(s.positionLimitEnd,s.restingPosition+t),e)}(t,i,e),this},prev(t=1,i=!0,e=!0){return function(t,i,e){n(t),e=Boolean(e),!0===i&&h()?l(s.positionLimitEnd,e):l(Math.max(0,s.restingPosition-t),e)}(t,i,e),this},to(t=0,i=!0){return function(t,i){n(t),i=Boolean(i),l(Math.min(s.positionLimitEnd,Math.max(0,Number(t))),i)}(t,i),this},length:()=>c.slides.getElementsByTagName("li").length,countInView:()=>{return Number((t=c.container,window.getComputedStyle(t).getPropertyValue("--numOfSlidesInView")));var t},countSteps(){return this.count()-this.countInView()},isEnd:()=>f(),isStart:()=>h()}}const o=e({selector:".one",cursor:"grab",minMoveToChangePosition:75});setInterval((()=>{o.next()}),2e3),e({selector:".two"}).next(),e({selector:".three"})})();