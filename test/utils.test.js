import { getCSSValue, setCSSValue } from '../src/js/utils.js'

test('should return CSS property', () => {
  document.body.innerHTML = `
    <div class="carousel" style=" --position: 100; "></div>
  `
  const position = getCSSValue(document.querySelector('.carousel'), '--position')
  expect(position).toBe('100')
})

test('should set CSS property', () => {
  document.body.innerHTML = `
    <div class="carousel" style=" --position: 2; "></div>
  `
  setCSSValue(document.querySelector('.carousel'), '--position', 28)
  const position = getCSSValue(document.querySelector('.carousel'), '--position')
  expect(position).toBe('28')
})
