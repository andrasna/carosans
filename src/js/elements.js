export function glideableElements(selector) {
  return {
    get container() {
      return document.querySelector(selector)
    },

    get slides() {
      return this.container.querySelector('ul:first-child')
    },

    get firstSlide() {
      return this.container.querySelector('li:first-child')
    },
    
    get secondSlide() {
      return this.container.querySelector('li:nth-child(2)')
    },

    get lastSlide() {
      return this.container.querySelector('li:last-child')
    },
  }
}