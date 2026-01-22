import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import type { BildegalleriProps } from '../../../../product/sections/offentlig-detaljside-for-utleieobjekt/types'

export default function Bildegalleri({
  images,
  currentIndex: controlledIndex,
  onImageChange
}: BildegalleriProps) {
  const [internalIndex, setInternalIndex] = useState(0)
  const currentIndex = controlledIndex !== undefined ? controlledIndex : internalIndex

  const handlePrevious = () => {
    const newIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1
    if (onImageChange) {
      onImageChange(newIndex)
    } else {
      setInternalIndex(newIndex)
    }
  }

  const handleNext = () => {
    const newIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1
    if (onImageChange) {
      onImageChange(newIndex)
    } else {
      setInternalIndex(newIndex)
    }
  }

  const handleThumbnailClick = (index: number) => {
    if (onImageChange) {
      onImageChange(index)
    } else {
      setInternalIndex(index)
    }
  }

  if (images.length === 0) {
    return (
      <div className="w-full h-96 bg-stone-200 dark:bg-stone-700 rounded-lg flex items-center justify-center">
        <p className="text-stone-500 dark:text-stone-400">Ingen bilder tilgjengelig</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative w-full h-96 rounded-lg overflow-hidden bg-stone-200 dark:bg-stone-700">
        <img
          src={images[currentIndex]}
          alt={`Bilde ${currentIndex + 1} av ${images.length}`}
          className="w-full h-full object-cover"
        />
        
        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <Button
              variant="outline"
              size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 dark:bg-stone-800/90 hover:bg-white dark:hover:bg-stone-800"
              onClick={handlePrevious}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 dark:bg-stone-800/90 hover:bg-white dark:hover:bg-stone-800"
              onClick={handleNext}
            >
              <ArrowRight className="w-5 h-5" />
            </Button>
          </>
        )}

        {/* Image Counter */}
        {images.length > 1 && (
          <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-md text-sm">
            {currentIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => handleThumbnailClick(index)}
              className={`flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden border-2 transition-all ${
                index === currentIndex
                  ? 'border-stone-900 dark:border-stone-100 ring-2 ring-stone-400 dark:ring-stone-600'
                  : 'border-stone-200 dark:border-stone-700 hover:border-stone-400 dark:hover:border-stone-500'
              }`}
            >
              <img
                src={image}
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
