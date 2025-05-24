"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ChevronDown, ChevronUp, ChevronLeft, ChevronRight, Camera, MapPin, Edit, X, Download } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { TextAnimate } from "@/components/magicui/text-animate";
import { useRouter } from "next/navigation";

interface PhotoStory {
  id: number;
  title: string;
  description: string;
  imageUrl: string | string[];
  location: string;
  displayType: "single" | "carousel";
}

interface CarouselProps {
  images: string[];
  title: string;
  onImageClick: (imageUrl: string) => void;
}

function ImageCarousel({ images, title, onImageClick }: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  
  const goToNext = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    setTimeout(() => setIsAnimating(false), 500);
  };
  
  const goToPrev = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    setTimeout(() => setIsAnimating(false), 500);
  };
  
  return (
    <div className="relative overflow-hidden rounded-xl aspect-[16/9] group shadow-xl">
      <div className="relative h-full w-full">
        {images.map((src, index) => (
          <motion.div
            key={`image-${index}-${title}`}
            className="absolute inset-0"
            initial={{ opacity: 0, x: index > currentIndex ? 100 : -100 }}
            animate={{
              opacity: index === currentIndex ? 1 : 0,
              x: index === currentIndex ? 0 : index > currentIndex ? 100 : -100,
              zIndex: index === currentIndex ? 10 : 0
            }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            <Image
              src={src}
              alt={`${title} - Image ${index + 1}`}
              fill
              className="object-contain rounded-lg cursor-pointer"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority={index === 0}
              onClick={() => onImageClick(src)}
            />
          </motion.div>
        ))}
      </div>
      
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <button
        onClick={goToPrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white text-black p-2 rounded-full opacity-0 group-hover:opacity-90 transition-opacity z-20 hover:bg-white/90 shadow-lg"
        aria-label="Image précédente"
      >
        <ChevronLeft size={24} />
      </button>
      
      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white text-black p-2 rounded-full opacity-0 group-hover:opacity-90 transition-opacity z-20 hover:bg-white/90 shadow-lg"
        aria-label="Image suivante"
      >
        <ChevronRight size={24} />
      </button>
      
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              if (isAnimating) return;
              setIsAnimating(true);
              setCurrentIndex(index);
              setTimeout(() => setIsAnimating(false), 500);
            }}
            className={cn(
              "w-2 h-2 rounded-full transition-all",
              index === currentIndex ? "bg-white scale-125" : "bg-white/50 hover:bg-white/80"
            )}
            aria-label={`Aller à l'image ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

export default function PhotoPage() {
  const router = useRouter();
  const storyRefs = useRef<(HTMLDivElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // États pour les données dynamiques
  const [photoStories, setPhotoStories] = useState<PhotoStory[]>([]);
  const [heroImage, setHeroImage] = useState<string>("/images/hero/hero-default.jpg");
  const [isLoading, setIsLoading] = useState(true);
  
  // État pour la lightbox
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  // Fonction pour télécharger l'image
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

  // Fonction pour ouvrir la lightbox
  const openLightbox = (imageUrl: string) => {
    setLightboxImage(imageUrl);
    document.body.style.overflow = 'hidden'; // Empêcher le scroll
  };

  // Fonction pour fermer la lightbox
  const closeLightbox = () => {
    setLightboxImage(null);
    document.body.style.overflow = 'unset'; // Rétablir le scroll
  };

  // Fermer la lightbox avec Escape
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && lightboxImage) {
        closeLightbox();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset'; // Cleanup
    };
  }, [lightboxImage]);
  
  // Charger la configuration au démarrage
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
          console.log("🖼️ Hero image définie:", config.heroImage);
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
    
    storyRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });
    
    return () => {
      storyRefs.current.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, [photoStories]);
  
  const scrollToStory = (id: number) => {
    storyRefs.current[id - 1]?.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement de la galerie...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="relative min-h-screen">
      {/* Hero Section */}
      <div className="relative h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src={heroImage}
            alt="Photo de couverture"
            fill
            className="object-contain rounded-lg cursor-pointer"
            priority
            onClick={() => openLightbox(heroImage)}
            onLoad={() => console.log("🖼️ Image hero chargée:", heroImage)}
            onError={(e) => console.error("❌ Erreur chargement image hero:", heroImage, e)}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" />
        </div>
        
        <div className="container relative z-10 px-4 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Badge variant="outline" className="backdrop-blur-md px-6 py-2 rounded-full mb-6 text-white border-white/20">
              <Camera size={18} className="mr-2" />
              <span className="font-medium">Galerie Photo</span>
            </Badge>
          </motion.div>
          
          <TextAnimate
            as="h1"
            animation="blurInDown"
            by="word"
            delay={0.2}
            className="text-5xl md:text-7xl font-bold mb-6 text-white"
          >
            Voyage en
          </TextAnimate>
          <TextAnimate
            as="span"
            animation="blurInDown"
            by="word"
            delay={0.3}
            className="text-5xl md:text-7xl font-bold text-primary"
          >
            Villes
          </TextAnimate>
          
          <TextAnimate
            animation="blurInUp"
            by="word"
            delay={0.4}
            className="text-xl text-white/90 max-w-2xl mx-auto mb-6"
          >
            Une histoire visuelle de mes aventures à travers le monde
          </TextAnimate>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="flex flex-wrap justify-center gap-2 mb-8"
          >
            {Array.from(new Set(photoStories.map(story => story.location.split(',')[0]))).map((city) => (
              <Badge 
                key={city} 
                variant="secondary" 
                className="text-sm px-3 py-1 backdrop-blur-sm bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
                onClick={() => scrollToStory(photoStories.find(story => story.location.includes(city))?.id || 1)}
              >
                <MapPin size={12} className="mr-1" />
                {city}
              </Badge>
            ))}
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Button 
              size="lg" 
              variant="default" 
              onClick={() => scrollToStory(1)} 
              className="rounded-full font-medium"
            >
              Explorer les histoires
            </Button>
          </motion.div>
        </div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <Button onClick={() => scrollToStory(1)} variant="ghost" size="icon" className="text-white rounded-full">
            <ChevronDown className="animate-bounce" size={32} />
          </Button>
        </motion.div>
      </div>
      
      {/* Photo Stories */}
      <div ref={containerRef} className="container mx-auto px-4 py-16">
        <div className="space-y-40">
          {photoStories.map((story, index) => (
            <div 
              key={story.id}
              ref={(el) => { storyRefs.current[index] = el; }}
              data-id={story.id}
              className="scroll-mt-24"
            >
              <div className="w-full">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
                  <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true, margin: "-100px" }}
                    className={`${index % 2 !== 0 ? 'md:order-2' : ''} px-4 md:px-8`}
                  >
                    <div className="flex items-center gap-3 mb-5">
                      <Separator className="w-12 bg-primary" />
                    </div>
                    <div className="flex flex-col gap-2 mb-6">
                      <Badge variant="default" className="self-start text-sm px-3 py-1 rounded-md">
                        <MapPin size={14} className="mr-1" />
                        <span className="font-semibold">{story.location}</span>
                      </Badge>
                      <div className="flex items-center gap-4 mt-2">
                        <div className="h-10 w-1.5 bg-primary rounded-full"></div>
                        <TextAnimate
                          as="h2"
                          animation="blurInDown"
                          by="word"
                          className="text-4xl md:text-5xl font-bold"
                        >
                          {story.title}
                        </TextAnimate>
                      </div>
                    </div>
                    <TextAnimate
                      animation="blurInUp"
                      by="line"
                      delay={0.2}
                      className="text-muted-foreground text-lg leading-relaxed"
                    >
                      {story.description}
                    </TextAnimate>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    viewport={{ once: true, margin: "-100px" }}
                    className={`${index % 2 !== 0 ? 'md:order-1' : ''}`}
                  >
                    <Card className="overflow-hidden border-0">
                      {story.displayType === "single" ? (
                        <div className="relative overflow-hidden aspect-[16/9]">
                          <Image
                            src={story.imageUrl as string}
                            alt={story.title}
                            fill
                            className="object-contain rounded-lg cursor-pointer transition-transform duration-700 hover:scale-105"
                            sizes="(max-width: 768px) 100vw, 50vw"
                            priority={index === 0}
                            onClick={() => openLightbox(story.imageUrl as string)}
                          />
                        </div>
                      ) : (
                        <ImageCarousel 
                          images={story.imageUrl as string[]} 
                          title={story.title} 
                          onImageClick={openLightbox}
                        />
                      )}
                    </Card>
                  </motion.div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Back to Top */}
      <div className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-center gap-6">
            <Button
              variant="outline"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="rounded-full"
            >
              <ChevronUp size={20} className="mr-2" />
              <span>Retour en haut</span>
            </Button>
            
            <p className="text-muted-foreground text-sm">
              © {new Date().getFullYear()} • Tous droits réservés
            </p>
          </div>
        </div>
      </div>

      {/* Bouton d'édition flottant */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => router.push("/photo/edit")}
          size="lg"
          className="rounded-full shadow-lg hover:shadow-xl transition-shadow"
        >
          <Edit size={20} className="mr-2" />
          Éditer
        </Button>
      </div>

      {/* Lightbox */}
      {lightboxImage && (
        <div 
          className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          <div className="relative max-w-[90vw] max-h-[90vh] w-full h-full">
            <Image
              src={lightboxImage}
              alt="Image en grand"
              fill
              className="object-contain rounded-lg"
              sizes="90vw"
              priority
            />
            <div className="absolute top-4 right-4 flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20 rounded-full"
                onClick={(e) => {
                  e.stopPropagation();
                  downloadImage(lightboxImage);
                }}
              >
                <Download size={24} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/20 rounded-full"
                onClick={closeLightbox}
              >
                <X size={24} />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
