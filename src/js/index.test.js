import { Glideable } from './index'
import { getCSSValue } from './utils'

document.body.innerHTML = `
<div
  class="glideable one"
  style="
    --position: 2;
    width: 1600px;
    --numOfSlidesInView: 3;
  ">
  <ul style="width: 1600px;">
    <li style="width: 500px;">
      <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Iure ipsum quos optio illo impedit eveniet.</p>
    </li>
    <li style="width: 500px;" >
      <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Iure ipsum quos optio illo impedit eveniet.</p>
    </li>
    <li style="width: 500px;" >
      <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Iure ipsum quos optio illo impedit eveniet.</p>
    </li>
    <li style="width: 500px;" >
      <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Iure ipsum quos optio illo impedit eveniet.</p>
    </li>
  </ul>
</div>
`

const a1 = Glideable({
  selector: '.one',
})

const a2 = Glideable({
  selector: '.one',
  explicitInit: true,
})

test('should return default position', () => {
  expect(a1.pos()).toBe(0)
})

test('should check if it is the starting position', () => {
  expect(a1.isStart()).toBe(true)
})

test('should check if it is the ending position', () => {
  expect(a2.isEnd()).toBe(false)
})

test('should return length of list', () => {
  expect(a1.length()).toBe(4)
})

test('should return value of numOfSlidesInView CSS property', () => {
  expect(a1.countInView(3)).toBe(3)
})

test('should return CSS property value', () => {
  expect(a1.countSteps()).toBe(1)
})

test('should throw error because it is not a number', () => {
  expect(() => {
    a1.next('some string')
  }).toThrow('Expected a number, instead the input was: some string')
})

test('should increment position by 1 twice', () => {
  const a = Glideable({
    selector: '.one',
    explicitInit: true,
  })

  a.next().next()
  const position = getCSSValue(document.querySelector('.one'), '--position')
  expect(position).toBe('2')
  expect(a.pos()).toBe(2)
})

test('should increment position to nth next', () => {
  const a = Glideable({
    selector: '.one',
    explicitInit: true,
  })

  a.to(1)
  a.next(2)
  const position = getCSSValue(document.querySelector('.one'), '--position')
  expect(position).toBe('3')
  expect(a.pos()).toBe(3)
})

test('should increment position to nth next, but cant be greater than end limit', () => {
  const a = Glideable({
    selector: '.one',
    explicitInit: true,
  })

  a.next(100)
  const position = getCSSValue(document.querySelector('.one'), '--position')
  expect(position).toBe('3')
  expect(a.pos()).toBe(3)
})

test('should rewind when reaching end position', () => {
  const a = Glideable({
    selector: '.one',
    explicitInit: true,
  })

  a.next().next().next().next()
  const position = getCSSValue(document.querySelector('.one'), '--position')
  expect(position).toBe('0')
  expect(a.pos()).toBe(0)
})

test('should decrement position by 1 twice', () => {
  const a = Glideable({
    selector: '.one',
    explicitInit: true,
  })

  a.to(3)
  a.prev().prev()

  const position = getCSSValue(document.querySelector('.one'), '--position')
  expect(position).toBe('1')
  expect(a.pos()).toBe(1)
})

test('should rewind when reaching start position', () => {
  const a = Glideable({
    selector: '.one',
    explicitInit: true,
  })

  a.to(3)
  a.prev().prev().prev().prev()

  const position = getCSSValue(document.querySelector('.one'), '--position')
  expect(position).toBe('3')
  expect(a.pos()).toBe(3)
})

test('should decrement position to nth next', () => {
  const a = Glideable({
    selector: '.one',
    explicitInit: true,
  })

  a.to(3)
  a.prev(3)
  const position = getCSSValue(document.querySelector('.one'), '--position')
  expect(position).toBe('0')
  expect(a.pos()).toBe(0)
})

test('should decrement position to nth next, but cant be smaller than start limit', () => {
  const a = Glideable({
    selector: '.one',
    explicitInit: true,
  })

  a.to(3)
  a.prev(100)
  const position = getCSSValue(document.querySelector('.one'), '--position')
  expect(position).toBe('0')
  expect(a.pos()).toBe(0)
})

test('should go to nth position', () => {
  const a = Glideable({
    selector: '.one',
    explicitInit: true,
  })

  a.to(3)
  const position = getCSSValue(document.querySelector('.one'), '--position')
  expect(position).toBe('3')
  expect(a.pos()).toBe(3)
})

test('should go to nth position, but cant be greater than end limit', () => {
  const a = Glideable({
    selector: '.one',
    explicitInit: true,
  })

  a.to(100)
  const position = getCSSValue(document.querySelector('.one'), '--position')
  expect(position).toBe('3')
  expect(a.pos()).toBe(3)
})

test('should go to nth position, but cant be smaller than start limit', () => {
  const a = Glideable({
    selector: '.one',
    explicitInit: true,
  })

  a.to(-100)
  const position = getCSSValue(document.querySelector('.one'), '--position')
  expect(position).toBe('0')
  expect(a.pos()).toBe(0)
})
