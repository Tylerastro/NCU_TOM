import React, { useEffect, useRef, useState } from 'react'
import Script from 'next/script'

declare global {
  interface Window {
    A: any
  }
}

interface AladinLiteProps {
  aspectRatio?: string
  maxWidth?: string
  fov?: number
  projection?: string
  cooFrame?: string
  showCooGridControl?: boolean
  showSimbadPointerControl?: boolean
  showCooGrid?: boolean
  coord?: string
}

const AladinLite: React.FC<AladinLiteProps> = ({
  aspectRatio = '4/3',
  maxWidth = '100%',
  fov = 1,
  projection = 'AIT',
  cooFrame = 'equatorial',
  showCooGridControl = true,
  showSimbadPointerControl = true,
  showCooGrid = true,
  coord,
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const aladinInstanceRef = useRef<any>(null)
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 })
  const [aladinLoading, setAladinLoading] = useState(true)

  useEffect(() => {
    const updateSize = () => {
      console.log('updating size')
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth
        const [aspectWidth, aspectHeight] = aspectRatio.split('/').map(Number)
        const height = (width * aspectHeight) / aspectWidth
        setContainerSize({ width, height })
      }
    }

    updateSize()
    window.addEventListener('resize', updateSize)
    return () => window.removeEventListener('resize', updateSize)
  }, [aspectRatio, aladinLoading])

  useEffect(() => {
    if (window.A && containerSize.width > 0) {
      console.log('Initializing Aladin')
      window.A.init.then(() => {
        if (containerRef.current) {
          aladinInstanceRef.current = window.A.aladin(containerRef.current, {
            fov,
            projection,
            cooFrame,
            showCooGridControl,
            showSimbadPointerControl,
            showCooGrid,
          })

          if (coord) {
            aladinInstanceRef.current.gotoObject(coord)
          }
        }
      })
    }
  }, [
    containerSize,
    fov,
    projection,
    cooFrame,
    showCooGridControl,
    showSimbadPointerControl,
    showCooGrid,
    coord,
  ])

  return (
    <>
      <Script
        src="https://aladin.u-strasbg.fr/AladinLite/api/v3/latest/aladin.js"
        strategy="afterInteractive"
        onLoad={() => setAladinLoading(false)}
      />
      <div style={{ maxWidth, margin: '0 auto' }}>
        {aladinLoading && <p className="flex justify-center">Loading...</p>}
        <div
          ref={containerRef}
          style={{
            width: '100%',
            height: `${containerSize.height}px`,
            aspectRatio,
          }}
        />
      </div>
    </>
  )
}

export default AladinLite
