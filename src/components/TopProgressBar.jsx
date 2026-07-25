import { useEffect, useRef } from 'react'
import { useNavigation } from 'react-router'

function TopProgressBar() {
  const navigation = useNavigation()
  const barRef = useRef(null)
  const containerRef = useRef(null)

  useEffect(() => {
    const bar = barRef.current
    const container = containerRef.current
    if (!bar || !container) return

    if (navigation.state === 'loading') {
      container.style.opacity = '1'
      bar.style.transition = 'none'
      bar.style.width = '0%'
      requestAnimationFrame(() => {
        bar.style.transition = 'width 300ms ease-out'
        bar.style.width = '70%'
      })
    } else if (navigation.state === 'idle') {
      bar.style.transition = 'width 200ms ease-out'
      bar.style.width = '100%'
      setTimeout(() => {
        container.style.opacity = '0'
        setTimeout(() => { bar.style.width = '0%' }, 300)
      }, 200)
    }
  }, [navigation.state])

  return (
    <div ref={containerRef} className="fixed left-0 right-0 top-0 z-[100] h-1 opacity-0 transition-opacity duration-200">
      <div ref={barRef} className="h-full bg-emerald-500" />
    </div>
  )
}

export default TopProgressBar
