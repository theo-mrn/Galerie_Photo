"use client"

import * as React from "react"

interface WindowSizeState {
  width: number
  height: number
  offsetTop: number
}

/**
 * Custom hook to track window size and viewport information
 * @returns Current window dimensions and offsetTop
 */
export function useWindowSize(): WindowSizeState {
  const [windowSize, setWindowSize] = React.useState<WindowSizeState>({
    width: 0,
    height: 0,
    offsetTop: 0,
  })

  React.useEffect(() => {
    // Fonction pour obtenir les dimensions actuelles
    function getWindowSize() {
      if (typeof window === "undefined") {
        return { width: 0, height: 0, offsetTop: 0 }
      }

      const vp = window.visualViewport
      if (vp) {
        return {
          width: vp.width || window.innerWidth,
          height: vp.height || window.innerHeight,
          offsetTop: vp.offsetTop || 0,
        }
      }

      return {
        width: window.innerWidth,
        height: window.innerHeight,
        offsetTop: 0,
      }
    }

    // Fonction de gestion du redimensionnement avec throttling
    let timeoutId: NodeJS.Timeout
    function handleResize() {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => {
        const newSize = getWindowSize()
        
        setWindowSize((prevSize) => {
          // Ne met à jour que si les valeurs ont vraiment changé
          if (
            newSize.width === prevSize.width &&
            newSize.height === prevSize.height &&
            newSize.offsetTop === prevSize.offsetTop
          ) {
            return prevSize
          }
          return newSize
        })
      }, 16) // ~60fps
    }

    // Définir la taille initiale
    setWindowSize(getWindowSize())

    // Ajouter les event listeners
    window.addEventListener("resize", handleResize, { passive: true })
    
    const vp = window.visualViewport
    if (vp) {
      vp.addEventListener("resize", handleResize)
      vp.addEventListener("scroll", handleResize)
    }

    // Cleanup
    return () => {
      clearTimeout(timeoutId)
      window.removeEventListener("resize", handleResize)
      if (vp) {
        vp.removeEventListener("resize", handleResize)
        vp.removeEventListener("scroll", handleResize)
      }
    }
  }, []) // Dépendances vides pour éviter les re-renders

  return windowSize
}
