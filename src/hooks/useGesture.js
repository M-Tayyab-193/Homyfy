import { useState, useCallback, useRef, useEffect } from 'react'

/**
 * Custom hook for handling drag/swipe gestures
 * Supports both mouse (desktop) and touch (mobile) events
 */
export const useGesture = ({ 
  onDragStart, 
  onDrag, 
  onDragEnd,
  threshold = 5 // Minimum movement to start drag
}) => {
  const [isDragging, setIsDragging] = useState(false)
  const dragState = useRef({
    startX: 0,
    startY: 0,
    currentX: 0,
    currentY: 0,
    offsetX: 0,
    offsetY: 0,
    positions: [], // Track positions for velocity calculation
    startTime: 0
  })

  /**
   * Start drag/touch
   */
  const handleStart = useCallback((clientX, clientY) => {
    dragState.current = {
      startX: clientX,
      startY: clientY,
      currentX: clientX,
      currentY: clientY,
      offsetX: 0,
      offsetY: 0,
      positions: [{ x: clientX, y: clientY, time: Date.now() }],
      startTime: Date.now()
    }
    
    if (onDragStart) {
      onDragStart({ x: clientX, y: clientY })
    }
  }, [onDragStart])

  /**
   * Handle drag/touch move
   */
  const handleMove = useCallback((clientX, clientY) => {
    const { startX, startY, positions } = dragState.current
    const offsetX = clientX - startX
    const offsetY = clientY - startY

    // Check if movement exceeds threshold to start dragging
    if (!isDragging && Math.abs(offsetX) < threshold && Math.abs(offsetY) < threshold) {
      return
    }

    if (!isDragging) {
      setIsDragging(true)
    }

    dragState.current.currentX = clientX
    dragState.current.currentY = clientY
    dragState.current.offsetX = offsetX
    dragState.current.offsetY = offsetY
    
    // Track position for velocity calculation (keep last 10)
    dragState.current.positions = [
      ...positions.slice(-9),
      { x: clientX, y: clientY, time: Date.now() }
    ]

    if (onDrag) {
      onDrag({
        startX: dragState.current.startX,
        startY: dragState.current.startY,
        currentX: clientX,
        currentY: clientY,
        offsetX,
        offsetY,
        positions: dragState.current.positions
      })
    }
  }, [isDragging, threshold, onDrag])

  /**
   * End drag/touch
   */
  const handleEnd = useCallback(() => {
    if (onDragEnd && isDragging) {
      onDragEnd({
        offsetX: dragState.current.offsetX,
        offsetY: dragState.current.offsetY,
        positions: dragState.current.positions,
        duration: Date.now() - dragState.current.startTime
      })
    }
    
    setIsDragging(false)
    dragState.current.positions = []
  }, [isDragging, onDragEnd])

  // Mouse events
  const handleMouseDown = useCallback((e) => {
    e.preventDefault()
    handleStart(e.clientX, e.clientY)
  }, [handleStart])

  const handleMouseMove = useCallback((e) => {
    if (dragState.current.startX !== 0) {
      e.preventDefault()
      handleMove(e.clientX, e.clientY)
    }
  }, [handleMove])

  const handleMouseUp = useCallback(() => {
    handleEnd()
  }, [handleEnd])

  // Touch events
  const handleTouchStart = useCallback((e) => {
    const touch = e.touches[0]
    handleStart(touch.clientX, touch.clientY)
  }, [handleStart])

  const handleTouchMove = useCallback((e) => {
    if (e.touches.length > 0) {
      const touch = e.touches[0]
      handleMove(touch.clientX, touch.clientY)
    }
  }, [handleMove])

  const handleTouchEnd = useCallback(() => {
    handleEnd()
  }, [handleEnd])

  // Add global mouse move/up listeners when dragging
  useEffect(() => {
    if (dragState.current.startX !== 0) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [handleMouseMove, handleMouseUp])

  return {
    isDragging,
    dragState: dragState.current,
    handlers: {
      onMouseDown: handleMouseDown,
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
    }
  }
}

export default useGesture
