"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Camera, 
  MapPin, 
  X, 
  Download,
  Eye,
  Sparkles,
  Grid3X3,
  Layout
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import React from "react";
import ImageCarouselComponent from '@/components/ImageCarousel';

interface PhotoStory {
  id: number;
  title: string;
  description: string;
  imageUrl: string | string[];
  location: string;
  displayType: "single" | "carousel";
}

export default function PhotoPage() {
  const storyRefs = useRef<(HTMLDivElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [photoStories, setPhotoStories] = useState<PhotoStory[]>([]);
  const [heroImage, setHeroImage] = useState<string>("/images/hero/hero-default.jpg");
  const [isLoading, setIsLoading] = useState(true);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'stories' | 'grid'>('stories');

  // Add cache-busting parameter to image URL
  const addCacheBuster = (url: string) => {
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}t=${Date.now()}`;
  };

  const downloadImage = async (imageUrl: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = imageUrl.split('/').pop() || 'image.jpg';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Erreur lors du téléchargement:', error);
    }
  };

  const openLightbox = (imageUrl: string) => {
    setLightboxImage(imageUrl);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setLightboxImage(null);
    document.body.style.overflow = 'unset';
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && lightboxImage) {
        closeLightbox();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [lightboxImage]);
  
  useEffect(() => {
    const loadGalleryConfig = async () => {
      try {
        console.log("🔄 Chargement de la configuration...");
        const response = await fetch('/api/gallery-config', {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache'
          }
        });
        
        if (response.ok) {
          const config = await response.json();
          console.log("✅ Configuration chargée:", config);
          setPhotoStories(config.photoStories);
          setHeroImage(config.heroImage);
        } else {
          console.error("❌ Erreur response:", response.status);
        }
      } catch (error) {
        console.error("❌ Erreur lors du chargement de la galerie:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadGalleryConfig();
  }, []);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Observation des sections visibles sans action spécifique
          }
        });
      },
      { threshold: 0.6, rootMargin: "-10% 0px -10% 0px" }
    );
    
    // Observer les éléments actuels
    const currentRefs = storyRefs.current.filter(ref => ref !== null);
    currentRefs.forEach((ref) => {
      if (ref) observer.observe(ref);
    });
    
    return () => {
      // Nettoyer seulement les éléments actuellement observés
      currentRefs.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
      observer.disconnect();
    };
  }, [photoStories.length]); // Dépendre seulement de la longueur pour éviter les re-renders infinis
  
  // Obtenir toutes les images de toutes les histoires pour la vue grille
  const getAllImages = () => {
    const allImages: { url: string; title: string; location: string; storyId: number }[] = [];
    photoStories.forEach(story => {
      if (Array.isArray(story.imageUrl)) {
        story.imageUrl.forEach(url => {
          if (url && url.trim() !== '') {
            allImages.push({
              url,
              title: story.title,
              location: story.location,
              storyId: story.id
            });
          }
        });
      } else if (story.imageUrl && typeof story.imageUrl === 'string' && story.imageUrl.trim() !== '') {
        allImages.push({
          url: story.imageUrl,
          title: story.title,
          location: story.location,
          storyId: story.id
        });
      }
    });
    return allImages;
  };

  // Composant grille des photos
  const PhotoGrid = () => {
    const allImages = getAllImages();
    
    return (
      <section className="py-20 px-6 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-slate-800 via-blue-600 to-indigo-600 bg-clip-text text-transparent dark:from-slate-100 dark:via-blue-400 dark:to-indigo-400">
              Galerie Photos
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Toutes mes photos de voyage dans une vue d&apos;ensemble
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {allImages.map((image, index) => (
              <motion.div
                key={`${image.storyId}-${index}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group relative overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 bg-white dark:bg-slate-800"
              >
                <div className="aspect-square relative overflow-hidden">
                  <Image
                    src={image.url}
                    alt={image.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110 cursor-pointer"
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    onClick={() => openLightbox(image.url)}
                  />
                  
                  {/* Overlay avec info */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300" />
                  
                  {/* Boutons d'action */}
                  <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 z-10">
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                      <Button
                        size="sm"
                        className="bg-white/20 backdrop-blur-md text-white hover:bg-white/30 rounded-full border border-white/30 shadow-lg"
                        onClick={(e) => {
                          e.stopPropagation()
                          openLightbox(image.url)
                        }}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                      <Button
                        size="sm"
                        className="bg-white/20 backdrop-blur-md text-white hover:bg-white/30 rounded-full border border-white/30 shadow-lg"
                        onClick={(e) => {
                          e.stopPropagation()
                          downloadImage(image.url)
                        }}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                    </motion.div>
                  </div>
                  
                  {/* Info de la photo */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white opacity-0 group-hover:opacity-100 transition-all duration-300 z-10">
                    <h3 className="font-semibold text-sm mb-1 truncate">{image.title}</h3>
                    <p className="text-xs opacity-90 flex items-center">
                      <MapPin className="w-3 h-3 mr-1" />
                      {image.location}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {allImages.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <Camera size={64} className="mx-auto mb-4 text-slate-400 opacity-50" />
              <h3 className="text-xl font-semibold text-slate-600 dark:text-slate-300 mb-2">
                Aucune photo disponible
              </h3>
              <p className="text-slate-500 dark:text-slate-400">
                Les photos seront bientôt ajoutées à la galerie
              </p>
            </motion.div>
          )}
        </div>
      </section>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-950">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-blue-200 dark:border-blue-800 rounded-full animate-spin border-t-blue-600 dark:border-t-blue-400 mx-auto mb-6"></div>
            <Camera className="w-8 h-8 text-blue-600 dark:text-blue-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
          <p className="text-slate-600 dark:text-slate-300 text-lg font-medium">Chargement de la galerie...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="relative min-h-screen">
      {/* Hero Section Modernisé */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-950">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full opacity-20 animate-pulse" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-pink-400 to-orange-500 rounded-full opacity-15 animate-pulse delay-1000" />
        </div>

        {/* Hero Image Background */}
        <div className="absolute inset-0 z-0">
          <Image
            src={addCacheBuster(heroImage)}
            alt="Photo de couverture"
            fill
            className="object-contain cursor-pointer opacity-30"
            priority
            onClick={() => openLightbox(heroImage)}
            loading="eager"
            unoptimized
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/40" />
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
                Voyage en images
              </span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-slate-800 via-blue-600 to-indigo-600 bg-clip-text text-transparent dark:from-slate-100 dark:via-blue-400 dark:to-indigo-400">
              Mes Aventures
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto">
              Une histoire visuelle de mes voyages à travers le monde, 
              capturés avec passion et partagés avec vous.
            </p>
          </motion.div>
        </div>
      </section>
      
      {/* Photo Stories Section */}
      {viewMode === 'stories' && (
      <section ref={containerRef} className="py-20 px-6 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="space-y-32">
            {photoStories.map((story, index) => (
              <motion.div 
                key={story.id}
                ref={(el) => { storyRefs.current[index] = el }}
                data-id={story.id}
                className="scroll-mt-24"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true, margin: "-100px" }}
              >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                  <motion.div
                    className={`${index % 2 !== 0 ? 'lg:order-2' : ''} space-y-6`}
                    initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    viewport={{ once: true }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-1 w-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full"></div>
                      <Badge 
                        variant="default" 
                        className="px-4 py-2 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
                      >
                        <MapPin size={16} className="mr-2" />
                        {story.location}
                      </Badge>
                    </div>
                    
                    <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-800 via-blue-600 to-indigo-600 bg-clip-text text-transparent dark:from-gray-100 dark:via-blue-400 dark:to-indigo-400">
                      {story.title}
                    </h2>
                    
                    <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                      {story.description}
                    </p>
                  </motion.div>
                  
                  <motion.div
                    className={`${index % 2 !== 0 ? 'lg:order-1' : ''}`}
                    initial={{ opacity: 0, x: index % 2 === 0 ? 50 : -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                    viewport={{ once: true }}
                    whileHover={{ 
                      y: -10,
                      rotateX: 5,
                      rotateY: index % 2 === 0 ? 5 : -5,
                      transition: { duration: 0.3 }
                    }}
                    style={{ transformStyle: "preserve-3d" }}
                  >
                    {story.displayType === "single" ? (
                      <div className="relative overflow-hidden rounded-2xl aspect-[16/10] shadow-2xl group bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
                        {story.imageUrl && typeof story.imageUrl === 'string' && story.imageUrl.trim() !== '' ? (
                          <>
                            <Image
                              src={addCacheBuster(story.imageUrl as string)}
                              alt={story.title}
                              fill
                              className="object-contain rounded-2xl cursor-pointer transition-transform duration-700 group-hover:scale-105"
                              sizes="(max-width: 768px) 100vw, 50vw"
                              priority={index === 0}
                              onClick={() => openLightbox(story.imageUrl as string)}
                              loading="eager"
                              unoptimized
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            
                            {/* Hover overlay */}
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <div className="flex gap-3">
                                <Button
                                  size="sm"
                                  className="bg-white/20 backdrop-blur-md text-white hover:bg-white/30 rounded-full border border-white/30"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    openLightbox(story.imageUrl as string)
                                  }}
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  className="bg-white/20 backdrop-blur-md text-white hover:bg-white/30 rounded-full border border-white/30"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    downloadImage(story.imageUrl as string)
                                  }}
                                >
                                  <Download className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </>
                        ) : (
                          // Placeholder quand aucune image n'est disponible
                          <div className="flex items-center justify-center h-full text-slate-400 dark:text-slate-500">
                            <div className="text-center">
                              <Camera size={64} className="mx-auto mb-4 opacity-50" />
                              <p className="text-lg font-medium">Image en cours d&apos;ajout</p>
                              <p className="text-sm">Cette histoire sera bientôt illustrée</p>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="relative">
                        {story.displayType === "carousel" && Array.isArray(story.imageUrl) && story.imageUrl.length > 0 && (
                          <ImageCarouselComponent 
                            images={story.imageUrl.filter(url => url && url.trim() !== '')} 
                            title={story.title} 
                            onImageClick={openLightbox}
                            onDownloadImage={downloadImage}
                          />
                        )}
                      </div>
                    )}
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* Photo Grid Section */}
      {viewMode === 'grid' && <PhotoGrid />}

      {/* Floating View Toggle Button */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 1 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <Button
            onClick={() => setViewMode(viewMode === 'stories' ? 'grid' : 'stories')}
            size="lg"
            className="group bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 p-4"
          >
            {viewMode === 'stories' ? (
              <>
                <Grid3X3 className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
              </>
            ) : (
              <>
                <Layout className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
              </>
            )}
          </Button>
        </motion.div>
      </motion.div>


      {/* Lightbox modernisée */}
      <AnimatePresence>
        {lightboxImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
            onClick={closeLightbox}
          >
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative max-w-[90vw] max-h-[90vh] w-full h-full"
            >
              <Image
                src={lightboxImage}
                alt="Image en grand"
                fill
                className="object-contain rounded-xl"
                sizes="90vw"
                priority
              />
              <div className="absolute top-4 right-4 flex gap-2">
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-white/20 rounded-full backdrop-blur-md bg-black/20 border border-white/20"
                    onClick={(e) => {
                      e.stopPropagation();
                      downloadImage(lightboxImage);
                    }}
                  >
                    <Download size={24} />
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-white/20 rounded-full backdrop-blur-md bg-black/20 border border-white/20"
                    onClick={closeLightbox}
                  >
                    <X size={24} />
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
