function LoadingSpinner({ fullScreen }) {
  if (fullScreen) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-airbnb-primary"></div>
      </div>
    )
  }
  
  return (
    <div className="flex items-center justify-center p-4">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-airbnb-primary"></div>
    </div>
  )
}

export default LoadingSpinner