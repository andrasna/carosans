import Carousel from '../src/js/index.js'
import { getCarouselElements } from '../src/js/elements.js'
import { carouselClassNames } from '../src/js/attrNames.js'

function createDocumentMock() {
  document.body.innerHTML = `
    <div
      class="carousel-outer"
      style="
        --position: 0;
        width: 1600px;
        --numOfItemsInView: 3;
      ">
      <ul class="carousel-inner" style="width: 1600px;">
        <li class="carousel-item" style="width: 500px;">
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Iure ipsum quos optio illo impedit eveniet.</p>
        </li>
        <li class="carousel-item" style="width: 500px;" >
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Iure ipsum quos optio illo impedit eveniet.</p>
        </li>
        <li class="carousel-item" style="width: 500px;" >
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Iure ipsum quos optio illo impedit eveniet.</p>
        </li>
        <li class="carousel-item" style="width: 500px;" >
          <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Iure ipsum quos optio illo impedit eveniet.</p>
        </li>
      </ul>
    </div>
  `
}

/**
 * Before each test
 */

let carousel = null

beforeEach(() => {
  createDocumentMock()

  const elements = getCarouselElements(`.${carouselClassNames.outer}`)

  elements.getNthItem(1).getBoundingClientRect = () => ({
    left: 0,
  })

  elements.getNthItem(2).getBoundingClientRect = () => ({
    left: 400,
  })

  elements.lastItem.getBoundingClientRect = () => ({
    right: 1600,
  })

  carousel = Carousel()
})

/**
 * Test API
 */

test('should throw error because it is not a number', () => {
  expect(() => {
    carousel.next('some string')
  }).toThrow('Expected a number, instead the input was: some string')
})

test('should return default position', () => {
  expect(carousel.pos()).toBe(0)
})

test('should check if it is the starting position', () => {
  expect(carousel.isStart()).toBe(true)
})

test('should check if it is the ending position', () => {
  expect(carousel.isEnd()).toBe(false)
})

test('should return length of list', () => {
  expect(carousel.length()).toBe(4)
})

test('should return value of numOfItemsInView CSS property', () => {
  expect(carousel.countInView(3)).toBe(3)
})

test('should return CSS property value', () => {
  expect(carousel.countSteps()).toBe(1)
})

test('should increment position by 1 twice', () => {
  carousel
    .next()
    .next()
  expect(carousel.pos()).toBe(2)
})

test('should increment position to nth next', () => {
  carousel.next(2)
  expect(carousel.pos()).toBe(2)
})

test('should increment position to nth next, but cant be greater than end limit', () => {
  carousel.next(100)
  expect(carousel.pos()).toBe(4)
})

test('should rewind when reaching end position', () => {
  carousel
    .next()
    .next()
    .next()
    .next()
    .next()
  expect(carousel.pos()).toBe(0)
})

test('should decrement position by 1 twice', () => {
  carousel.to(3)
  carousel
    .prev()
    .prev()
  expect(carousel.pos()).toBe(1)
})

test('should rewind when reaching start position', () => {
  carousel.to(3)
  carousel
    .prev()
    .prev()
    .prev()
    .prev()
  expect(carousel.pos()).toBe(4)
})

test('should decrement position to nth next', () => {
  carousel.to(3)
  carousel.prev(3)
  expect(carousel.pos()).toBe(0)
})

test('should decrement position to nth next, but cant be smaller than start limit', () => {
  carousel.to(3)
  carousel.prev(100)
  expect(carousel.pos()).toBe(0)
})

test('should go to nth position', () => {
  carousel.to(3)
  expect(carousel.pos()).toBe(3)
})

test('should go to nth position, but cant be greater than end limit', () => {
  carousel.to(100)
  expect(carousel.pos()).toBe(4)
})

test('should go to nth position, but cant be smaller than start limit', () => {
  carousel.to(-100)
  expect(carousel.pos()).toBe(0)
})
