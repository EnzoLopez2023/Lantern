export const USER_STATE_SEGMENT_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._:-]*$/
export const USER_STATE_SEGMENT_MAX = 200
export const KB_PROGRESS_PREFIX = 'kb-tts-progress:'

export function validateUserStateSegment(value, name = 'user-state key') {
  if (
    typeof value !== 'string' ||
    value.length < 1 ||
    value.length > USER_STATE_SEGMENT_MAX ||
    !USER_STATE_SEGMENT_PATTERN.test(value)
  ) {
    const error = new Error(
      `${name} must use the user-state key charset and be at most ${USER_STATE_SEGMENT_MAX} characters`,
    )
    error.code = 'VALIDATION'
    throw error
  }
  return value
}

export function kbProgressResourceKey(guideId) {
  if (typeof guideId !== 'string' || !guideId) {
    const error = new Error('guideId is required')
    error.code = 'VALIDATION'
    throw error
  }
  return validateUserStateSegment(`${KB_PROGRESS_PREFIX}${guideId}`, 'guideId')
}
