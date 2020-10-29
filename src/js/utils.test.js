import { getCSSValue, setCSSValue } from './utils.js'

test('should return CSS property', () => {
  document.body.innerHTML = `
    <div class="carosans one" style=" --position: 100; "></div>
  `
  const position = getCSSValue(document.querySelector('.one'), '--position')
  expect(position).toBe('100')
})

test('should set CSS property', () => {
  document.body.innerHTML = `
    <div class="carosans one" style=" --position: 2; "></div>
  `
  setCSSValue(document.querySelector('.one'), '--position', 28)
  const position = getCSSValue(document.querySelector('.one'), '--position')
  expect(position).toBe('28')
})
