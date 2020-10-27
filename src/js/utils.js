export function getWidth(el) {
  return el.clientWidth
}

export function getCSSValue(el, prop) {
  return window.getComputedStyle(el).getPropertyValue(prop)
}

export function setCSSValue(el, prop, val) {
  el.style.setProperty(prop, val)
}
