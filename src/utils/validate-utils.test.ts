import { isValidName, isValidPhoneNumber, isValidWordPhrase } from './validate-utils'

test('isValidWordPhrase ', () => {
  expect(
    isValidWordPhrase('Bí 2 asdlkfjaslkdfj ', {
      greaterThanOrEqual: 1,
      alphabet: true,
      accent: true,
      space: true,
      integer: true,
      lessThanOrEqual: 20,
    }),
  ).toBeTruthy()
})

describe.each([
  { name: 'Bí 2 asdlkfjaslkdfj', expected: true },
  { name: 'a# ii', expected: false },
  { name: '', expected: false },
])('isValidName', ({ name, expected }) => {
  test(`${name} => ${expected ? 'valid' : 'invalid'}`, () => {
    expect(isValidName(name)).toBe(expected)
  })
})
describe.each<{ input: any; expected: boolean }>([
  { input: '+841234567890', expected: true },
  { input: '+84123456789', expected: true },
  { input: '+841234567', expected: true },
  { input: '+61292389239', expected: true }, // australia
  { input: 1234567902, expected: false },
  { input: -1, expected: false },
  { input: null, expected: false },
  { input: undefined, expected: false },
  { input: false, expected: false },
  { input: '', expected: false },
  { input: 'asdfkj993712', expected: false },
])('isValidPhoneNumber', ({ input, expected }) => {
  test(`${input} => ${expected ? 'valid' : 'invalid'}`, () => {
    expect(isValidPhoneNumber(input)).toBe(expected)
  })
})
