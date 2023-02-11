const toString = Object.prototype.toString

const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor

export function is(val, type) {
  return toString.call(val) === `[object ${type}]`
}

export function isObject(val) {
  return val !== null && is(val, 'Object')
}

export function isString(val) {
  return is(val, 'String')
}

export function isArray(val) {
  return val && Array.isArray(val)
}

export function isEmpty(val) {
  if (isArray(val) || isString(val)) {
    return val.length === 0
  }

  if (val instanceof Map || val instanceof Set) {
    return val.size === 0
  }

  if (isObject(val)) {
    return Object.keys(val).length === 0
  }

  return false
}

export function isDate(val) {
  return is(val, 'Date')
}

export function isFunction(fn) {
  return typeof fn === 'function'
}

export function isAsyncFunction(val) {
  return val instanceof AsyncFunction
}

export function isPromise(val) {
  return (
    is(val, 'Promise') &&
    val instanceof Promise &&
    [val.then, val.catch, val.finally].every(isFunction)
  )
}

export function isWindow(val) {
  return typeof window !== 'undefined' && is(val, 'Window')
}

export const isServer = typeof window === 'undefined'

export const isClient = !isServer

export function isUrl(path) {
  const reg =
    /(((^https?:(?:\/\/)?)(?:[-;:&=+$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=+$,\w]+@)[A-Za-z0-9.-]+)((?:\/[+~%/.\w-_]*)?\??(?:[-+=&;%@.\w_]*)#?(?:[\w]*))?)$/
  return reg.test(path)
}
