"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Eye, Heart, Download, Share2, Filter, Grid3X3, LayoutGrid } from "lucide-react"
import { Button } from "@/components/ui/button"

const photoCategories = [
  "Tous",
  "Paysages",
  "Portraits",
  "Architecture",
  "Nature",
  "Voyage"
]

const samplePhotos = [
  {
    id: 1,
    src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop",
    category: "Paysages",
    title: "Coucher de soleil montagnard",
    likes: 142,
    views: 1205
  },
  {
    id: 2,
    src: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&h=400&fit=crop",
    category: "Nature",
    title: "Forêt mystique",
    likes: 89,
    views: 856
  },
  {
    id: 3,
    src: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600&h=400&fit=crop",
    category: "Paysages",
    title: "Vallée verdoyante",
    likes: 203,
    views: 1580
  },
  {
    id: 4,
    src: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&h=400&fit=crop",
    category: "Nature",
    title: "Lac de montagne",
    likes: 156,
    views: 945
  },
  {
    id: 5,
    src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop",
    category: "Architecture",
    title: "Structure moderne",
    likes: 78,
    views: 632
  },
  {
    id: 6,
    src: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&h=400&fit=crop",
    category: "Voyage",
    title: "Aventure urbaine",
    likes: 124,
    views: 1002
  }
]

export function PhotoGallery() {
  const [selectedCategory, setSelectedCategory] = useState("Tous")
  const [gridSize, setGridSize] = useState("medium")
  const [hoveredPhoto, setHoveredPhoto] = useState<number | null>(null)

  const filteredPhotos = selectedCategory === "Tous" 
    ? samplePhotos 
    : samplePhotos.filter(photo => photo.category === selectedCategory)

  const getGridCols = () => {
    switch (gridSize) {
      case "small": return "grid-cols-2 md:grid-cols-4 lg:grid-cols-5"
      case "medium": return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
      case "large": return "grid-cols-1 md:grid-cols-2"
      default: return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
    }
  }

  return (
    <section className="py-20 px-6 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-800 via-blue-600 to-indigo-600 bg-clip-text text-transparent dark:from-gray-100 dark:via-blue-400 dark:to-indigo-400 mb-4">
            Ma Collection
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Une sélection soigneusement organisée de mes meilleures captures, 
            chaque image raconte une histoire unique.
          </p>
        </motion.div>

        {/* Filters and Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4"
        >
          {/* Category filters */}
          <div className="flex flex-wrap gap-2">
            {photoCategories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className={`transition-all duration-300 ${
                  selectedCategory === category
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
                    : "hover:bg-blue-50 hover:border-blue-300 dark:hover:bg-blue-950"
                }`}
              >
                <Filter className="w-4 h-4 mr-2" />
                {category}
              </Button>
            ))}
          </div>

          {/* Grid size controls */}
          <div className="flex gap-2">
            <Button
              variant={gridSize === "small" ? "default" : "outline"}
              size="sm"
              onClick={() => setGridSize("small")}
              className="p-2"
            >
              <Grid3X3 className="w-4 h-4" />
            </Button>
            <Button
              variant={gridSize === "medium" ? "default" : "outline"}
              size="sm"
              onClick={() => setGridSize("medium")}
              className="p-2"
            >
              <LayoutGrid className="w-4 h-4" />
            </Button>
            <Button
              variant={gridSize === "large" ? "default" : "outline"}
              size="sm"
              onClick={() => setGridSize("large")}
              className="p-2"
            >
              <LayoutGrid className="w-4 h-4 scale-125" />
            </Button>
          </div>
        </motion.div>

        {/* Photo Grid */}
        <motion.div
          layout
          className={`grid gap-6 ${getGridCols()}`}
        >
          <AnimatePresence>
            {filteredPhotos.map((photo, index) => (
              <motion.div
                key={photo.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative overflow-hidden rounded-xl bg-white dark:bg-gray-800 shadow-lg hover:shadow-2xl transition-all duration-500"
                onMouseEnter={() => setHoveredPhoto(photo.id)}
                onMouseLeave={() => setHoveredPhoto(null)}
                style={{
                  transform: hoveredPhoto === photo.id ? "translateY(-10px) rotateX(5deg)" : "translateY(0) rotateX(0deg)",
                  transformStyle: "preserve-3d"
                }}
              >
                {/* Image */}
                <div className="relative overflow-hidden aspect-[4/3]">
                  <motion.img
                    src={photo.src}
                    alt={photo.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    whileHover={{ scale: 1.1 }}
                  />
                  
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Hover actions */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ 
                      opacity: hoveredPhoto === photo.id ? 1 : 0,
                      y: hoveredPhoto === photo.id ? 0 : 20 
                    }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <div className="flex gap-3">
                      <Button
                        size="sm"
                        variant="outline"
                        className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30"
                      >
                        <Heart className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30"
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="bg-white/20 backdrop-blur-sm border-white/30 text-white hover:bg-white/30"
                      >
                        <Share2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </motion.div>
                </div>

                {/* Photo info */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-2">
                    {photo.title}
                  </h3>
                  <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400">
                    <span className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-full">
                      {photo.category}
                    </span>
                    <div className="flex gap-4">
                      <span className="flex items-center gap-1">
                        <Heart className="w-3 h-3" />
                        {photo.likes}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {photo.views}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Load more button */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center mt-12"
        >
          <Button
            size="lg"
            variant="outline"
            className="bg-white/50 backdrop-blur-sm border-gray-200 dark:border-gray-700 hover:bg-white dark:hover:bg-gray-800 px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Charger plus de photos
          </Button>
        </motion.div>
      </div>
    </section>
  )
} 