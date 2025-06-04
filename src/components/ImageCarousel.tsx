import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Eye, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ImageCarouselProps {
  images: string[];
  title: string;
  onImageClick: (url: string) => void;
  onDownloadImage: (url: string) => void;
}

export default function ImageCarousel({ images, title, onImageClick, onDownloadImage }: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  // Add cache-busting parameter to image URL
  const addCacheBuster = (url: string) => {
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}t=${Date.now()}`;
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.8
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.8
    })
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setCurrentIndex((prevIndex) => {
      let newIndex = prevIndex + newDirection;
      if (newIndex < 0) newIndex = images.length - 1;
      if (newIndex >= images.length) newIndex = 0;
      return newIndex;
    });
  };

  return (
    <div className="w-full py-10">
      {/* Title Section - Apple Style */}
      <div className="max-w-7xl mx-auto px-4 mb-8">
        <h2 className="text-xl md:text-5xl font-bold text-neutral-800 dark:text-neutral-200 font-sans">
          {title}
        </h2>
      </div>

      {/* Main Carousel Container - Landscape Format */}
      <div className="relative w-full max-w-6xl mx-auto px-4">
        <div className="relative overflow-hidden rounded-3xl aspect-[21/9] shadow-2xl group bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border border-gray-200/50 dark:border-gray-700/50">
          
          {/* Images Container */}
          <div className="absolute inset-0 flex items-center justify-center">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={currentIndex}
                className="absolute w-full h-full"
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.3 },
                  scale: { duration: 0.3 }
                }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={1}
                onDragEnd={(e, { offset, velocity }) => {
                  const swipe = swipePower(offset.x, velocity.x);

                  if (swipe < -swipeConfidenceThreshold) {
                    paginate(1);
                  } else if (swipe > swipeConfidenceThreshold) {
                    paginate(-1);
                  }
                }}
              >
                <div className="w-full h-full p-6 md:p-8">
                  <Image
                    src={addCacheBuster(images[currentIndex])}
                    alt={`${title} - Image ${currentIndex + 1}`}
                    fill
                    className="object-contain cursor-pointer transition-all duration-700 group-hover:scale-[1.02] rounded-2xl"
                    sizes="(max-width: 768px) 100vw, 80vw"
                    priority={currentIndex === 0}
                    onClick={() => onImageClick(images[currentIndex])}
                    loading="eager"
                    unoptimized
                  />
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/5 via-transparent to-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Navigation Buttons - Apple Style */}
            <div className="absolute inset-0 flex items-center justify-between p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <motion.div 
                whileHover={{ scale: 1.1 }} 
                whileTap={{ scale: 0.9 }}
                className="z-10"
              >
                <Button
                  size="icon"
                  variant="secondary"
                  className="w-12 h-12 rounded-full bg-white/80 backdrop-blur-xl hover:bg-white/90 shadow-lg border border-white/20 dark:bg-gray-800/80 dark:hover:bg-gray-700/90 dark:border-gray-600/20"
                  onClick={(e) => {
                    e.stopPropagation();
                    paginate(-1);
                  }}
                >
                  <ChevronLeft className="w-6 h-6 text-gray-700 dark:text-gray-200" />
                </Button>
              </motion.div>

              <motion.div 
                whileHover={{ scale: 1.1 }} 
                whileTap={{ scale: 0.9 }}
                className="z-10"
              >
                <Button
                  size="icon"
                  variant="secondary"
                  className="w-12 h-12 rounded-full bg-white/80 backdrop-blur-xl hover:bg-white/90 shadow-lg border border-white/20 dark:bg-gray-800/80 dark:hover:bg-gray-700/90 dark:border-gray-600/20"
                  onClick={(e) => {
                    e.stopPropagation();
                    paginate(1);
                  }}
                >
                  <ChevronRight className="w-6 h-6 text-gray-700 dark:text-gray-200" />
                </Button>
              </motion.div>
            </div>

            {/* Image Actions - Apple Style */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  size="sm"
                  className="bg-white/80 backdrop-blur-xl text-gray-700 hover:bg-white/90 rounded-full border border-white/20 shadow-lg dark:bg-gray-800/80 dark:text-gray-200 dark:hover:bg-gray-700/90 dark:border-gray-600/20 px-4 py-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    onImageClick(images[currentIndex]);
                  }}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  <span className="text-sm font-medium">View</span>
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  size="sm"
                  className="bg-white/80 backdrop-blur-xl text-gray-700 hover:bg-white/90 rounded-full border border-white/20 shadow-lg dark:bg-gray-800/80 dark:text-gray-200 dark:hover:bg-gray-700/90 dark:border-gray-600/20 px-4 py-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDownloadImage(images[currentIndex]);
                  }}
                >
                  <Download className="w-4 h-4 mr-2" />
                  <span className="text-sm font-medium">Download</span>
                </Button>
              </motion.div>
            </div>

            {/* Image Counter - Apple Style */}
            <div className="absolute top-6 right-6 bg-black/20 backdrop-blur-xl text-white px-4 py-2 rounded-full text-sm font-medium border border-white/10">
              {currentIndex + 1} of {images.length}
            </div>
          </div>
        </div>

        {/* Dots Indicator - Apple Style */}
        <div className="flex justify-center mt-8 space-x-2">
          {images.map((_, index) => (
            <motion.button
              key={index}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? 'bg-neutral-800 dark:bg-neutral-200 w-8' 
                  : 'bg-neutral-300 dark:bg-neutral-600 hover:bg-neutral-400 dark:hover:bg-neutral-500'
              }`}
              onClick={() => {
                setDirection(index > currentIndex ? 1 : -1);
                setCurrentIndex(index);
              }}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.8 }}
            />
          ))}
        </div>
      </div>
    </div>
  );
} 