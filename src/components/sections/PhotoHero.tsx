"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Camera, Sparkles, ArrowRight, Play } from "lucide-react"
import { Button } from "@/components/ui/button"

const floatingPhotos = [
  {
    id: 1,
    src: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400&h=300&fit=crop",
    alt: "Paysage magnifique"
  },
  {
    id: 2,
    src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
    alt: "Montagne au coucher du soleil"
  },
  {
    id: 3,
    src: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop",
    alt: "Forêt mystérieuse"
  },
  {
    id: 4,
    src: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=300&fit=crop",
    alt: "Lac de montagne"
  }
]

export function PhotoHero() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: (e.clientY / window.innerHeight) * 2 - 1
      })
    }
    
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-950">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full opacity-20 animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-pink-400 to-orange-500 rounded-full opacity-15 animate-pulse delay-1000" />
      </div>

      {/* Floating photos with 3D effect */}
      <div className="absolute inset-0 pointer-events-none">
        {floatingPhotos.map((photo, index) => (
          <motion.div
            key={photo.id}
            className="absolute rounded-xl overflow-hidden shadow-2xl"
            style={{
              width: "200px",
              height: "150px",
              left: `${20 + (index * 15)}%`,
              top: `${25 + (index * 10)}%`,
            }}
            animate={{
              x: mousePosition.x * (10 + index * 5),
              y: mousePosition.y * (15 + index * 3),
              rotateX: mousePosition.y * (5 + index * 2),
              rotateY: mousePosition.x * (5 + index * 2),
            }}
            transition={{
              type: "spring",
              stiffness: 50,
              damping: 20
            }}
            whileHover={{
              scale: 1.1,
              rotateX: 10,
              rotateY: 10,
              transition: { duration: 0.3 }
            }}
          >
            <img
              src={photo.src}
              alt={photo.alt}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          </motion.div>
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 mb-6">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Vos souvenirs, sublimés
            </span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-slate-800 via-blue-600 to-indigo-600 bg-clip-text text-transparent dark:from-slate-100 dark:via-blue-400 dark:to-indigo-400">
            Mes Photos
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto">
            Découvrez une collection unique de moments immortalisés, 
            organisés avec soin dans une galerie interactive moderne.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Button
            size="lg"
            className="group bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-3 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
          >
            <Camera className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform duration-300" />
            Explorer la galerie
            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
          </Button>
          
          <Button
            variant="outline"
            size="lg"
            className="group bg-white/20 backdrop-blur-sm border-white/30 hover:bg-white/30 px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" />
            Voir le diaporama
          </Button>
        </motion.div>

        {/* Stats section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-16 grid grid-cols-3 gap-8 max-w-lg mx-auto"
        >
          {[
            { number: "500+", label: "Photos" },
            { number: "25", label: "Albums" },
            { number: "4K", label: "Qualité" }
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-slate-100">
                {stat.number}
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-6 h-10 border-2 border-slate-400 dark:border-slate-500 rounded-full flex justify-center"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-1 h-3 bg-slate-400 dark:bg-slate-500 rounded-full mt-2"
          />
        </motion.div>
      </motion.div>
    </section>
  )
} 