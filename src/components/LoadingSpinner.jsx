function LoadingSpinner({ size = 'medium' }) {
  const sizeClass = size === 'small' ? 'h-4 w-4 border-2' : 'h-8 w-8 border-[3px]'

  return (
    <div className={`animate-spin rounded-full border-blue-200 border-t-blue-600 ${sizeClass}`} aria-hidden="true" />
  )
}

export default LoadingSpinner
