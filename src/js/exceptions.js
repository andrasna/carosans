export function handleNotNumber(num) {
  if (typeof num !== 'number') {
    throw new Error(
      `Expected a number, instead the input was: ${num}`,
    )
  }
}
