export function asyncRoute(handler) {
  return (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next)
}

export function integer(value, name, { min = 0, max = Number.MAX_SAFE_INTEGER } = {}) {
  if (!Number.isSafeInteger(value) || value < min || value > max) {
    const error = new Error(`${name} must be an integer between ${min} and ${max}`)
    error.code = 'VALIDATION'
    throw error
  }
  return value
}

export function boundedString(value, name, { min = 1, max = 200, pattern } = {}) {
  if (typeof value !== 'string' || value.length < min || value.length > max) {
    const error = new Error(`${name} must be a string between ${min} and ${max} characters`)
    error.code = 'VALIDATION'
    throw error
  }
  if (pattern && !pattern.test(value)) {
    const error = new Error(`${name} has an invalid format`)
    error.code = 'VALIDATION'
    throw error
  }
  return value
}
