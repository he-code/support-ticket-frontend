import { useEffect, useRef } from 'react'
import { useNavigation } from 'react-router'

function TopProgressBar() {
  const navigation = useNavigation()
  const barRef = useRef(null)
  const containerRef = useRef(null)
  const timersRef = useRef([])

  useEffect(() => {
    const bar = barRef.current
    const container = containerRef.current
    if (!bar || !container) return

    if (navigation.state === 'loading') {
      container.style.opacity = '1'
      bar.style.transition = 'none'
      bar.style.width = '0%'
      requestAnimationFrame(() => {
        bar.style.transition = 'width 400ms ease-out'
        bar.style.width = '70%'
      })
    } else if (navigation.state === 'idle') {
      bar.style.transition = 'width 300ms ease-out'
      bar.style.width = '100%'

      const hideTimer = setTimeout(() => {
        container.style.opacity = '0'

        const resetTimer = setTimeout(() => {
          bar.style.width = '0%'
        }, 300)

        timersRef.current.push(resetTimer)
      }, 250)

      timersRef.current.push(hideTimer)
    }

    return () => {
      // Evita que timers de un estado anterior apaguen la barra
      // durante una carga nueva (navegaciones rapidas).
      timersRef.current.forEach((timer) => clearTimeout(timer))
      timersRef.current = []
    }
  }, [navigation.state])

  return (
    <div ref={containerRef} className="fixed left-0 right-0 top-0 z-[100] h-0.5 opacity-0 transition-opacity duration-200">
      <div ref={barRef} className="h-full bg-accent" />
    </div>
  )
}

export default TopProgressBar