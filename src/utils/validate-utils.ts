import { parsePhoneNumber, isValidPhoneNumber as isValidPhoneNumberFn } from 'libphonenumber-js'

/**
 * @deprecated
 */
export const isValidNameIncludeNumberCharSpace = (name: string): boolean => {
  const integer = '0-9'
  const accentWord =
    'a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ'
  const space = '\\s'
  const pattern = `^([${integer}${accentWord}${space}]{1,})$`
  const regExp = new RegExp(pattern)
  // /^([0-9a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\s]{1,})$/
  return regExp.test(name)
}

export const isValidName = (name: string): boolean =>
  isValidWordPhrase(name, {
    space: true,
    integer: true,
    alphabet: true,
    greaterThanOrEqual: 1,
    accent: true,
    lessThanOrEqual: 20,
  })

export const isValidWordPhrase = (
  name: string,
  where?: {
    integer?: boolean
    alphabet?: boolean
    accent?: boolean
    space?: boolean
    greaterThanOrEqual?: number
    lessThanOrEqual?: number
  },
): boolean => {
  const {
    accent: hasAccent,
    alphabet: hasAlphabet,
    greaterThanOrEqual = 0,
    lessThanOrEqual,
    integer: hasInteger,
    space: hasSpace,
  } = where ?? {}
  const integer = hasInteger ? '0-9' : ''
  const alphabet = hasAlphabet ? 'a-zA-Z' : ''
  const accent = hasAccent
    ? 'ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ'
    : ''
  const space = hasSpace ? '\\s' : ''

  // {1,} means: match from 1 symbol to positive infinity (>= 1)
  const pattern = `^([${integer}${alphabet}${accent}${space}]{${greaterThanOrEqual},${
    lessThanOrEqual ? lessThanOrEqual : ''
  }})$`
  const regExp = new RegExp(pattern)
  //full regExp: /^([0-9a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\s]{1,})$/
  return regExp.test(name)
}

export const isValidEmail = (email: string): boolean => {
  const regExp = /^\w+([\\.-]?\w+)*@\w+([\\.-]?\w+)*(\.\w{2,3})+$/
  return regExp.test(email)
}

export const isValidPhoneNumber = (phoneNumber: any) => {
  const normalizedPhoneNumber = (() => {
    try {
      return parsePhoneNumber(phoneNumber)
    } catch (error) {
      // console.log('isValidPhoneNumber.error:', error)
    }
  })()
  return isValidPhoneNumberFn(normalizedPhoneNumber?.number ?? '')
}
