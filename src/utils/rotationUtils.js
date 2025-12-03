/**
 * Utility functions for pseudo-360° image rotation
 */

/**
 * Maps drag distance to image index based on sensitivity
 * @param {number} dragOffset - Total horizontal drag distance in pixels
 * @param {number} imageCount - Total number of images
 * @param {number} sensitivity - Pixels needed to move one image (default: 50)
 * @returns {number} - The calculated image index offset
 */
export const mapDragToIndex = (dragOffset, imageCount, sensitivity = 50) => {
  const indexOffset = Math.round(dragOffset / sensitivity)
  return indexOffset
}

/**
 * Normalizes index to handle circular array wrapping
 * @param {number} index - Current index
 * @param {number} arrayLength - Length of the array
 * @returns {number} - Normalized index within bounds
 */
export const normalizeIndex = (index, arrayLength) => {
  const normalized = index % arrayLength
  return normalized < 0 ? normalized + arrayLength : normalized
}

/**
 * Calculates velocity from drag events
 * @param {Array} positions - Array of {x, time} objects from recent drag events
 * @returns {number} - Velocity in pixels per millisecond
 */
export const calculateVelocity = (positions) => {
  if (positions.length < 2) return 0
  
  const recent = positions.slice(-5) // Use last 5 positions
  const firstPos = recent[0]
  const lastPos = recent[recent.length - 1]
  
  const deltaX = lastPos.x - firstPos.x
  const deltaTime = lastPos.time - firstPos.time
  
  return deltaTime > 0 ? deltaX / deltaTime : 0
}

/**
 * Applies momentum to current position
 * @param {number} currentIndex - Current image index
 * @param {number} velocity - Current velocity
 * @param {number} imageCount - Total images
 * @param {number} friction - Friction coefficient (0-1, default: 0.95)
 * @returns {number} - New index after momentum applied
 */
export const applyMomentum = (currentIndex, velocity, imageCount, friction = 0.95) => {
  const momentumSteps = Math.abs(velocity) * 100 // Scale velocity
  const direction = velocity > 0 ? 1 : -1
  const newIndex = currentIndex + (direction * Math.round(momentumSteps))
  
  return normalizeIndex(newIndex, imageCount)
}

/**
 * Determines transition type based on rotation speed
 * @param {number} indexDelta - Difference in image indices
 * @param {number} threshold - Threshold for fast rotation (default: 2)
 * @returns {string} - 'fade' or 'slide'
 */
export const getTransitionType = (indexDelta, threshold = 2) => {
  return Math.abs(indexDelta) >= threshold ? 'slide' : 'fade'
}

/**
 * Calculates rotation progress as a percentage
 * @param {number} currentIndex - Current image index
 * @param {number} totalImages - Total number of images
 * @returns {number} - Progress from 0-100
 */
export const getRotationProgress = (currentIndex, totalImages) => {
  return (currentIndex / totalImages) * 100
}

/**
 * Gets direction of rotation
 * @param {number} oldIndex - Previous index
 * @param {number} newIndex - New index
 * @param {number} totalImages - Total images
 * @returns {string} - 'clockwise' or 'counterclockwise'
 */
export const getRotationDirection = (oldIndex, newIndex, totalImages) => {
  const normalizedOld = normalizeIndex(oldIndex, totalImages)
  const normalizedNew = normalizeIndex(newIndex, totalImages)
  
  // Check shortest path
  const forward = (normalizedNew - normalizedOld + totalImages) % totalImages
  const backward = (normalizedOld - normalizedNew + totalImages) % totalImages
  
  return forward <= backward ? 'clockwise' : 'counterclockwise'
}

/**
 * Preloads adjacent images for smooth navigation
 * @param {Array} images - Array of image URLs
 * @param {number} currentIndex - Current image index
 * @param {number} preloadCount - Number of images to preload on each side (default: 2)
 * @returns {Promise} - Resolves when adjacent images are loaded
 */
export const preloadAdjacentImages = (images, currentIndex, preloadCount = 2) => {
  const promises = []
  
  for (let i = -preloadCount; i <= preloadCount; i++) {
    if (i === 0) continue // Skip current image
    
    const index = normalizeIndex(currentIndex + i, images.length)
    const img = new Image()
    img.src = typeof images[index] === 'string' ? images[index] : images[index]?.url
    
    promises.push(
      new Promise((resolve, reject) => {
        img.onload = resolve
        img.onerror = resolve // Don't fail entire preload if one image fails
      })
    )
  }
  
  return Promise.all(promises)
}

/**
 * Calculates easing for smooth animation
 * @param {number} t - Progress (0-1)
 * @param {string} type - Easing type: 'easeOut', 'easeInOut', 'spring'
 * @returns {number} - Eased value
 */
export const easing = {
  easeOut: (t) => 1 - Math.pow(1 - t, 3),
  easeInOut: (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
  spring: (t) => 1 - Math.cos(t * Math.PI * 0.5)
}
