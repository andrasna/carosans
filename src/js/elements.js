export function glideableElements(selector) {
  const container = document.querySelector(selector)

  if (container === null) {
    throw new Error('Selector did not match.')
  }

  return {
    get container() {
      return container
    },

    get slides() {
      return container.querySelector('ul:first-child')
    },

    get firstSlide() {
      return container.querySelector('li:first-child')
    },

    get secondSlide() {
      return container.querySelector('li:nth-child(2)')
    },

    get lastSlide() {
      return container.querySelector('li:last-child')
    },
  }
}
