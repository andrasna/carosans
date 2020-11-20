export function handleNotNumber(input) {
  if (typeof input !== 'number') {
    throw new Error(
      `Expected a number, instead the input was: ${input}`,
    )
  }
}

export function handleNullFromSelector(element) {
  if (element === null) {
    throw new Error('Expected an element, received null instead.')
  }
}
