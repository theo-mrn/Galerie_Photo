"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Upload, 
  X, 
  Save, 
  Eye, 
  Plus, 
  Trash2, 
  Camera, 
  MapPin,
  ArrowLeft,
  ImageIcon,
  Sparkles,
  Edit3,
  Grid3X3,
  Image as ImageLucide,
  Wand2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import BackToTop from "@/components/magicui/back-to-top";

interface PhotoStory {
  id: number;
  title: string;
  description: string;
  imageUrl: string | string[];
  location: string;
  displayType: "single" | "carousel";
}

interface UploadedImage {
  file: File;
  preview: string;
  name: string;
}

export default function PhotoEditPage() {
  const router = useRouter();
  const fileInputRefs = useRef<{ [key: number]: HTMLInputElement | null }>({});
  
  // État initial des histoires photo
  const [photoStories, setPhotoStories] = useState<PhotoStory[]>([
    {
      id: 1,
      title: "Premiers pas en Italie",
      description: "Les rues pavées de Rome racontent des histoires millénaires. Chaque coin de rue révèle un nouveau chapitre de l'histoire, entre architecture antique et vie moderne qui s'entremêlent parfaitement.",
      imageUrl: "/images/stories/rome-default.jpg",
      location: "Rome, Italie",
      displayType: "single"
    },
    {
      id: 2,
      title: "Coucher de soleil à Santorin",
      description: "Les maisons blanches contrastent avec le bleu profond de la mer Égée. Le soleil couchant peint le ciel de teintes orangées et roses, créant un tableau naturel à couper le souffle.",
      imageUrl: ["/images/stories/santorin-1.jpg", "/images/stories/santorin-2.jpg", "/images/stories/santorin-3.jpg"],
      location: "Santorin, Grèce",
      displayType: "carousel"
    },
    {
      id: 3,
      title: "Forêts du Japon",
      description: "Perdus dans les forêts de bambous d'Arashiyama, nous avons découvert une tranquillité rare. Le bruissement des feuilles et la lumière filtrée créent une atmosphère presque mystique.",
      imageUrl: "/images/stories/japon-default.jpg",
      location: "Arashiyama, Japon",
      displayType: "single"
    },
    {
      id: 4,
      title: "Marchés colorés de Marrakech",
      description: "Une explosion de couleurs, d'odeurs et de sons. Les souks de Marrakech sont une expérience sensorielle complète, où chaque allée révèle de nouveaux trésors artisanaux.",
      imageUrl: ["/images/stories/marrakech-1.jpg", "/images/stories/marrakech-2.jpg", "/images/stories/marrakech-3.jpg", "/images/stories/marrakech-4.jpg"],
      location: "Marrakech, Maroc",
      displayType: "carousel"
    },
  ]);

  const [heroImage, setHeroImage] = useState<string>("/images/hero/hero-default.jpg");
  const [uploadedImages, setUploadedImages] = useState<{ [key: number]: UploadedImage[] }>({});
  const [heroUploadedImage, setHeroUploadedImage] = useState<UploadedImage | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Charger les images existantes au démarrage
  useEffect(() => {
    const loadExistingImages = async () => {
      try {
        // Charger la configuration sauvegardée
        const configResponse = await fetch('/api/gallery-config');
        if (configResponse.ok) {
          const config = await configResponse.json();
          setHeroImage(config.heroImage);
          setPhotoStories(config.photoStories);
          toast.success("Configuration chargée");
        }
      } catch (error) {
        console.error("Erreur lors du chargement de la configuration:", error);
        toast.error("Erreur lors du chargement de la configuration");
      }
    };

    loadExistingImages();
  }, []);

  // Fonction pour uploader une image
  const uploadImage = async (file: File, folder: string = "stories"): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);

    const response = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Erreur lors de l'upload");
    }

    const data = await response.json();
    return data.url;
  };

  // Gestion de l'upload d'images pour une histoire
  const handleImageUpload = useCallback((storyId: number, files: FileList | null) => {
    if (!files) return;

    const newImages: UploadedImage[] = [];
    Array.from(files).forEach((file) => {
      if (file.type.startsWith("image/")) {
        const preview = URL.createObjectURL(file);
        newImages.push({
          file,
          preview,
          name: file.name,
        });
      }
    });

    setUploadedImages(prev => {
      const updatedImages = {
        ...prev,
        [storyId]: [...(prev[storyId] || []), ...newImages]
      };

      // Détecter automatiquement le type d'affichage
      const story = photoStories.find(s => s.id === storyId);
      if (story) {
        const currentImages = Array.isArray(story.imageUrl) ? story.imageUrl.length : (story.imageUrl ? 1 : 0);
        const totalImages = currentImages + updatedImages[storyId].length;
        
        const newDisplayType = totalImages > 1 ? "carousel" : "single";
        if (story.displayType !== newDisplayType) {
          // Mettre à jour le type d'affichage automatiquement
          setPhotoStories(prevStories => prevStories.map(s => 
            s.id === storyId ? { ...s, displayType: newDisplayType } : s
          ));
          toast.info(`Type d'affichage changé automatiquement en ${newDisplayType === "carousel" ? "carrousel" : "image unique"}`);
        }
      }

      return updatedImages;
    });

    toast.success(`${newImages.length} image(s) ajoutée(s) pour upload`);
  }, [photoStories]);

  // Gestion de l'upload de l'image hero
  const handleHeroImageUpload = useCallback((files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];
    if (file.type.startsWith("image/")) {
      const preview = URL.createObjectURL(file);
      setHeroUploadedImage({
        file,
        preview,
        name: file.name,
      });
      toast.success("Image de couverture prête pour upload");
    }
  }, []);

  // Supprimer une image existante
  const removeExistingImage = async (storyId: number, imageIndex: number) => {
    const story = photoStories.find(s => s.id === storyId);
    if (!story) return;

    let imageToDelete: string;
    if (Array.isArray(story.imageUrl)) {
      imageToDelete = story.imageUrl[imageIndex];
    } else {
      imageToDelete = story.imageUrl as string;
    }

    // Supprimer le fichier physique si ce n'est pas une URL par défaut
    if (imageToDelete && !imageToDelete.includes('default') && !imageToDelete.includes('placeholder')) {
      try {
        await fetch('/api/delete-image', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imageUrl: imageToDelete }),
        });
      } catch (error) {
        console.error('Erreur lors de la suppression du fichier:', error);
      }
    }

    // Mettre à jour l'état
    if (Array.isArray(story.imageUrl)) {
      const updatedImages = story.imageUrl.filter((_, index) => index !== imageIndex);
      const newDisplayType = updatedImages.length > 1 ? "carousel" : "single";
      
      setPhotoStories(prevStories => prevStories.map(s => 
        s.id === storyId 
          ? { 
              ...s, 
              imageUrl: updatedImages.length > 0 ? updatedImages : "", 
              displayType: newDisplayType 
            } 
          : s
      ));
    } else {
      setPhotoStories(prevStories => prevStories.map(s => 
        s.id === storyId ? { ...s, imageUrl: "", displayType: "single" } : s
      ));
    }

    toast.success("Image supprimée");
  };

  // Supprimer une image uploadée (pas encore sauvegardée)
  const removeUploadedImage = (storyId: number, index: number) => {
    setUploadedImages(prev => {
      const updatedImages = { ...prev };
      if (updatedImages[storyId]) {
        // Libérer l'URL de prévisualisation
        URL.revokeObjectURL(updatedImages[storyId][index].preview);
        updatedImages[storyId] = updatedImages[storyId].filter((_, i) => i !== index);
        
        // Si plus d'images uploadées, supprimer la clé
        if (updatedImages[storyId].length === 0) {
          delete updatedImages[storyId];
        }
      }
      return updatedImages;
    });
    toast.success("Image supprimée de la liste d'upload");
  };

  // Supprimer l'image hero existante
  const removeExistingHeroImage = async () => {
    if (heroImage && !heroImage.includes('default') && !heroImage.includes('placeholder')) {
      try {
        await fetch('/api/delete-image', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imageUrl: heroImage }),
        });
        setHeroImage("/images/hero/hero-default.jpg");
        toast.success("Image de couverture supprimée");
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        toast.error("Erreur lors de la suppression de l'image");
      }
    }
  };

  // Supprimer l'image hero uploadée
  const removeHeroImage = () => {
    if (heroUploadedImage) {
      URL.revokeObjectURL(heroUploadedImage.preview);
      setHeroUploadedImage(null);
      toast.success("Image de couverture supprimée de l'upload");
    }
  };

  const updateStory = <K extends keyof PhotoStory>(id: number, field: K, value: PhotoStory[K]) => {
    setPhotoStories(prev => prev.map(story => 
      story.id === id ? { ...story, [field]: value } : story
    ));
  };

  const addNewStory = () => {
    const newId = Math.max(...photoStories.map(s => s.id)) + 1;
    const newStory: PhotoStory = {
      id: newId,
      title: `Nouvelle histoire #${newId}`,
      description: "Décrivez votre aventure...",
      imageUrl: "",
      location: "Ville, Pays",
      displayType: "single"
    };
    setPhotoStories(prev => [...prev, newStory]);
    toast.success("Nouvelle histoire ajoutée");
  };

  const deleteStory = (id: number) => {
    setPhotoStories(prev => prev.filter(story => story.id !== id));
    // Supprimer aussi les images uploadées pour cette histoire
    setUploadedImages(prev => {
      const updated = { ...prev };
      delete updated[id];
      return updated;
    });
    toast.success("Histoire supprimée");
  };

  const saveChanges = async () => {
    setIsUploading(true);
    const loadingToast = toast.loading("Sauvegarde en cours...", { 
      duration: 10000 
    });

    try {
      // Upload des nouvelles images
      const updatedStories = [...photoStories];

      // Upload de l'image hero si nécessaire
      let finalHeroImage = heroImage;
      if (heroUploadedImage) {
        try {
          finalHeroImage = await uploadImage(heroUploadedImage.file, "hero");
          URL.revokeObjectURL(heroUploadedImage.preview);
          setHeroUploadedImage(null);
          setHeroImage(finalHeroImage);
        } catch (error) {
          console.error("Erreur upload hero:", error);
          toast.error("Erreur lors de l'upload de l'image de couverture");
        }
      }

      // Upload des images des histoires
      for (const story of updatedStories) {
        if (uploadedImages[story.id]) {
          try {
            const uploadedUrls = await Promise.all(
              uploadedImages[story.id].map(img => uploadImage(img.file))
            );

            // Libérer les URLs de prévisualisation
            uploadedImages[story.id].forEach(img => {
              URL.revokeObjectURL(img.preview);
            });

            // Combiner avec les images existantes
            if (Array.isArray(story.imageUrl)) {
              story.imageUrl = [...story.imageUrl, ...uploadedUrls];
            } else if (story.imageUrl) {
              story.imageUrl = [story.imageUrl, ...uploadedUrls];
            } else {
              story.imageUrl = uploadedUrls.length === 1 ? uploadedUrls[0] : uploadedUrls;
            }

            // Mise à jour automatique du type d'affichage
            const totalImages = Array.isArray(story.imageUrl) ? story.imageUrl.length : 1;
            story.displayType = totalImages > 1 ? "carousel" : "single";

          } catch (error) {
            console.error(`Erreur upload pour l'histoire ${story.id}:`, error);
            toast.error(`Erreur lors de l'upload des images pour "${story.title}"`);
          }
        }
      }

      // Nettoyer les images uploadées
      setUploadedImages({});

      // Sauvegarder la configuration
      const configResponse = await fetch('/api/gallery-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          heroImage: finalHeroImage,
          photoStories: updatedStories,
        }),
      });

      if (!configResponse.ok) {
        throw new Error("Erreur lors de la sauvegarde de la configuration");
      }

      toast.success("Toutes les modifications ont été sauvegardées avec succès !", { 
        id: loadingToast,
        duration: 4000 
      });

    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
      toast.error("Une erreur est survenue lors de la sauvegarde", { 
        id: loadingToast,
        duration: 4000 
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-950">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full opacity-10 animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-pink-400 to-orange-500 rounded-full opacity-10 animate-pulse delay-1000" />
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-gradient-to-bl from-green-400 to-blue-500 rounded-full opacity-5 animate-pulse delay-500" />
      </div>

      {/* Header modernisé */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg dark:bg-slate-900/80 border-b border-white/20 shadow-lg"
      >
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <motion.div 
              className="flex items-center gap-6"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => router.push("/photo")}
                  className="rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <ArrowLeft size={20} />
                </Button>
              </motion.div>
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500">
                    <Edit3 className="w-5 h-5 text-white" />
                  </div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 via-blue-600 to-indigo-600 bg-clip-text text-transparent dark:from-slate-100 dark:via-blue-400 dark:to-indigo-400">
                    Studio d&apos;Édition
                  </h1>
                </div>
                <p className="text-slate-600 dark:text-slate-300 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Créez et personnalisez vos histoires de voyage
                </p>
              </div>
            </motion.div>
            
            <motion.div 
              className="flex items-center gap-3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outline"
                  onClick={() => router.push("/photo")}
                  className="rounded-full border-2 border-blue-200 hover:border-blue-300 bg-white/50 backdrop-blur-sm hover:bg-white/70 transition-all duration-300"
                >
                  <Eye size={16} className="mr-2" />
                  Aperçu en direct
                </Button>
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={saveChanges}
                  disabled={isUploading}
                  className="rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 px-6"
                >
                  {isUploading ? (
                    <>
                      <div className="w-4 h-4 mr-2 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sauvegarde...
                    </>
                  ) : (
                    <>
                      <Save size={16} className="mr-2" />
                      Sauvegarder
                    </>
                  )}
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      <div className="container mx-auto px-6 py-12 relative z-10">
        <div className="space-y-12">
          {/* Section Hero modernisée */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="overflow-hidden border-0 shadow-2xl bg-white/80 backdrop-blur-lg dark:bg-slate-800/80">
              <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 p-1">
                <CardHeader className="bg-white dark:bg-slate-800 m-1 rounded-lg">
                  <CardTitle className="flex items-center gap-3 text-2xl">
                    <div className="p-3 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500">
                      <Camera className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        Image de Couverture
                      </span>
                      <p className="text-sm text-slate-500 dark:text-slate-400 font-normal mt-1">
                        L&apos;image principale qui accueille vos visiteurs
                      </p>
                    </div>
                  </CardTitle>
                </CardHeader>
              </div>
              
              <CardContent className="p-8 space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <motion.div 
                    className="space-y-4"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Label className="text-lg font-semibold flex items-center gap-2">
                      <ImageLucide className="w-5 h-5" />
                      Image actuelle
                    </Label>
                    <div className="relative aspect-video rounded-xl overflow-hidden border-2 border-slate-200 dark:border-slate-700 group shadow-xl">
                      <Image
                        src={heroUploadedImage?.preview || heroImage}
                        alt="Image de couverture"
                        fill
                        className="object-contain rounded-xl transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300" />
                      {!heroUploadedImage && heroImage !== "/images/hero/hero-default.jpg" && (
                        <motion.div 
                          className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300"
                          whileHover={{ scale: 1.05 }}
                        >
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={removeExistingHeroImage}
                            className="rounded-full bg-red-500/90 backdrop-blur-sm hover:bg-red-600 text-white shadow-lg"
                          >
                            <X size={16} className="mr-2" />
                            Supprimer
                          </Button>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                  
                  <div className="space-y-6">
                    <Label className="text-lg font-semibold flex items-center gap-2">
                      <Upload className="w-5 h-5" />
                      Nouvelle image
                    </Label>
                    <motion.div
                      className="border-2 border-dashed border-blue-300 dark:border-blue-700 rounded-xl p-8 text-center cursor-pointer hover:border-blue-400 dark:hover:border-blue-600 transition-all duration-300 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 hover:from-blue-100 hover:to-indigo-100 dark:hover:from-blue-900/50 dark:hover:to-indigo-900/50"
                      onClick={() => document.getElementById("hero-upload")?.click()}
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <motion.div
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <Upload size={48} className="mx-auto mb-4 text-blue-500" />
                      </motion.div>
                      <p className="text-slate-600 dark:text-slate-300 font-medium mb-2">
                        Cliquez pour uploader une nouvelle image de couverture
                      </p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Formats acceptés: JPG, PNG, WebP • Résolution recommandée: 1920x1080
                      </p>
                      <input
                        id="hero-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleHeroImageUpload(e.target.files)}
                      />
                    </motion.div>
                    
                    {heroUploadedImage && (
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-950/30 rounded-xl border border-green-200 dark:border-green-800"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 relative rounded-lg overflow-hidden">
                            <Image
                              src={heroUploadedImage.preview}
                              alt="Preview"
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <span className="text-sm font-medium text-green-700 dark:text-green-300 truncate block max-w-48">
                              {heroUploadedImage.name}
                            </span>
                            <span className="text-xs text-green-600 dark:text-green-400">
                              Prêt pour l&apos;upload
                            </span>
                          </div>
                        </div>
                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={removeHeroImage}
                            className="text-green-600 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors duration-200"
                          >
                            <X size={16} />
                          </Button>
                        </motion.div>
                      </motion.div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Section Histoires modernisée */}
          <motion.div 
            className="space-y-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-800 via-blue-600 to-indigo-600 bg-clip-text text-transparent dark:from-slate-100 dark:via-blue-400 dark:to-indigo-400 flex items-center gap-3">
                  <Grid3X3 className="w-8 h-8 text-blue-600" />
                  Histoires de Voyage
                </h2>
                <p className="text-slate-600 dark:text-slate-300 mt-2">
                  Créez et organisez vos aventures visuelles
                </p>
              </div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  onClick={addNewStory}
                  className="rounded-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 px-6"
                >
                  <Plus size={16} className="mr-2" />
                  Nouvelle Histoire
                </Button>
              </motion.div>
            </div>

            <div className="space-y-8">
              <AnimatePresence>
                {photoStories.map((story, index) => (
                  <motion.div
                    key={story.id}
                    layout
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -50, scale: 0.95 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card className="overflow-hidden border-0 shadow-xl bg-white/80 backdrop-blur-lg dark:bg-slate-800/80 hover:shadow-2xl transition-all duration-300">
                      <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 p-1">
                        <CardHeader className="bg-white dark:bg-slate-800 m-1 rounded-lg">
                          <div className="flex items-center justify-between">
                            <CardTitle className="flex items-center gap-3">
                              <div className="p-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500">
                                <MapPin className="w-5 h-5 text-white" />
                              </div>
                              <div>
                                <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent text-xl">
                                  Histoire #{story.id}
                                </span>
                                <div className="flex items-center gap-2 mt-1">
                                  <Badge 
                                    variant={story.displayType === "single" ? "default" : "secondary"}
                                    className={cn(
                                      "text-xs",
                                      story.displayType === "single" 
                                        ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300" 
                                        : "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300"
                                    )}
                                  >
                                    {story.displayType === "single" ? (
                                      <>
                                        <ImageLucide className="w-3 h-3 mr-1" />
                                        Image unique
                                      </>
                                    ) : (
                                      <>
                                        <Grid3X3 className="w-3 h-3 mr-1" />
                                        Carrousel
                                      </>
                                    )}
                                  </Badge>
                                  <Badge variant="outline" className="text-xs">
                                    {Array.isArray(story.imageUrl) ? story.imageUrl.length : (story.imageUrl ? 1 : 0)} image(s)
                                    {uploadedImages[story.id] && uploadedImages[story.id].length > 0 && 
                                      ` + ${uploadedImages[story.id].length} nouvelle(s)`
                                    }
                                  </Badge>
                                </div>
                              </div>
                            </CardTitle>
                            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => deleteStory(story.id)}
                                className="rounded-full bg-red-500/90 hover:bg-red-600 shadow-lg"
                              >
                                <Trash2 size={16} />
                              </Button>
                            </motion.div>
                          </div>
                        </CardHeader>
                      </div>
                      
                      <CardContent className="p-8 space-y-8">
                        {/* Informations de base */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <motion.div 
                            className="space-y-3"
                            whileHover={{ scale: 1.02 }}
                            transition={{ duration: 0.2 }}
                          >
                            <Label htmlFor={`title-${story.id}`} className="text-sm font-semibold flex items-center gap-2">
                              <Wand2 className="w-4 h-4" />
                              Titre de l&apos;histoire
                            </Label>
                            <Input
                              id={`title-${story.id}`}
                              value={story.title}
                              onChange={(e) => updateStory(story.id, "title", e.target.value)}
                              className="rounded-xl border-2 border-slate-200 dark:border-slate-700 focus:border-blue-400 dark:focus:border-blue-600 transition-colors duration-200 bg-white/50 dark:bg-slate-800/50"
                              placeholder="Un titre accrocheur..."
                            />
                          </motion.div>
                          <motion.div 
                            className="space-y-3"
                            whileHover={{ scale: 1.02 }}
                            transition={{ duration: 0.2 }}
                          >
                            <Label htmlFor={`location-${story.id}`} className="text-sm font-semibold flex items-center gap-2">
                              <MapPin className="w-4 h-4" />
                              Localisation
                            </Label>
                            <Input
                              id={`location-${story.id}`}
                              value={story.location}
                              onChange={(e) => updateStory(story.id, "location", e.target.value)}
                              className="rounded-xl border-2 border-slate-200 dark:border-slate-700 focus:border-blue-400 dark:focus:border-blue-600 transition-colors duration-200 bg-white/50 dark:bg-slate-800/50"
                              placeholder="Ville, Pays"
                            />
                          </motion.div>
                        </div>

                        <motion.div 
                          className="space-y-3"
                          whileHover={{ scale: 1.01 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Label htmlFor={`description-${story.id}`} className="text-sm font-semibold flex items-center gap-2">
                            <Edit3 className="w-4 h-4" />
                            Description de l&apos;aventure
                          </Label>
                          <Textarea
                            id={`description-${story.id}`}
                            value={story.description}
                            onChange={(e) => updateStory(story.id, "description", e.target.value)}
                            rows={4}
                            className="rounded-xl border-2 border-slate-200 dark:border-slate-700 focus:border-blue-400 dark:focus:border-blue-600 transition-colors duration-200 bg-white/50 dark:bg-slate-800/50 resize-none"
                            placeholder="Racontez votre histoire..."
                          />
                        </motion.div>

                        <Separator className="bg-gradient-to-r from-transparent via-slate-300 to-transparent dark:via-slate-600" />

                        {/* Gestion des images modernisée */}
                        <div className="space-y-6">
                          <div className="flex items-center justify-between">
                            <Label className="text-lg font-semibold flex items-center gap-2">
                              <Camera className="w-5 h-5" />
                              Galerie d&apos;Images
                            </Label>
                            <div className="flex items-center gap-2">
                              <Badge 
                                variant="secondary" 
                                className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                              >
                                {Array.isArray(story.imageUrl) ? story.imageUrl.length : (story.imageUrl ? 1 : 0)} actuelle(s)
                              </Badge>
                              {uploadedImages[story.id] && uploadedImages[story.id].length > 0 && (
                                <Badge 
                                  variant="default" 
                                  className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                                >
                                  +{uploadedImages[story.id].length} nouvelle(s)
                                </Badge>
                              )}
                            </div>
                          </div>

                          {/* Images actuelles */}
                          {Array.isArray(story.imageUrl) ? (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                              {story.imageUrl.map((url, imgIndex) => (
                                <motion.div 
                                  key={imgIndex} 
                                  className="relative aspect-square rounded-xl overflow-hidden border-2 border-slate-200 dark:border-slate-700 group shadow-lg"
                                  whileHover={{ scale: 1.05, y: -5 }}
                                  transition={{ duration: 0.2 }}
                                >
                                  <Image
                                    src={url}
                                    alt={`${story.title} - Image ${imgIndex + 1}`}
                                    fill
                                    className="object-cover rounded-xl transition-transform duration-500 group-hover:scale-110"
                                  />
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300" />
                                  <motion.div 
                                    className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300"
                                    whileHover={{ scale: 1.1 }}
                                  >
                                    <Button
                                      variant="destructive"
                                      size="sm"
                                      onClick={() => removeExistingImage(story.id, imgIndex)}
                                      className="rounded-full bg-red-500/90 backdrop-blur-sm hover:bg-red-600 text-white shadow-lg"
                                    >
                                      <X size={16} />
                                    </Button>
                                  </motion.div>
                                </motion.div>
                              ))}
                            </div>
                          ) : story.imageUrl && story.imageUrl !== "" ? (
                            <motion.div 
                              className="relative aspect-video rounded-xl overflow-hidden border-2 border-slate-200 dark:border-slate-700 max-w-md group shadow-lg"
                              whileHover={{ scale: 1.02, y: -3 }}
                              transition={{ duration: 0.2 }}
                            >
                              <Image
                                src={story.imageUrl}
                                alt={story.title}
                                fill
                                className="object-cover rounded-xl transition-transform duration-500 group-hover:scale-105"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300" />
                              <motion.div 
                                className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300"
                                whileHover={{ scale: 1.1 }}
                              >
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => removeExistingImage(story.id, 0)}
                                  className="rounded-full bg-red-500/90 backdrop-blur-sm hover:bg-red-600 text-white shadow-lg"
                                >
                                  <X size={16} className="mr-2" />
                                  Supprimer
                                </Button>
                              </motion.div>
                            </motion.div>
                          ) : (
                            <motion.div 
                              className="text-center py-12 text-slate-500 dark:text-slate-400 bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-800 dark:to-blue-950/50 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-600"
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ duration: 0.3 }}
                            >
                              <motion.div
                                animate={{ y: [0, -10, 0] }}
                                transition={{ duration: 2, repeat: Infinity }}
                              >
                                <ImageIcon size={64} className="mx-auto mb-4 opacity-30" />
                              </motion.div>
                              <p className="text-lg font-medium mb-2">Aucune image pour cette histoire</p>
                              <p className="text-sm">Ajoutez des images pour donner vie à votre aventure</p>
                            </motion.div>
                          )}

                          {/* Nouvelles images uploadées */}
                          {uploadedImages[story.id] && uploadedImages[story.id].length > 0 && (
                            <motion.div 
                              className="space-y-4"
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3 }}
                            >
                              <div className="flex items-center gap-2">
                                <Sparkles className="w-4 h-4 text-green-500" />
                                <Label className="text-sm font-medium text-green-600 dark:text-green-400">
                                  Nouvelles images à ajouter
                                </Label>
                              </div>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {uploadedImages[story.id].map((img, imgIndex) => (
                                  <motion.div 
                                    key={imgIndex} 
                                    className="relative aspect-square rounded-xl overflow-hidden border-2 border-green-300 dark:border-green-700 shadow-lg"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.3, delay: imgIndex * 0.1 }}
                                    whileHover={{ scale: 1.05, y: -3 }}
                                  >
                                    <Image
                                      src={img.preview}
                                      alt={img.name}
                                      fill
                                      className="object-cover rounded-xl"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-green-500/20 to-transparent" />
                                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                      <Button
                                        variant="destructive"
                                        size="sm"
                                        className="absolute top-2 right-2 rounded-full bg-red-500/90 hover:bg-red-600 shadow-lg"
                                        onClick={() => removeUploadedImage(story.id, imgIndex)}
                                      >
                                        <X size={12} />
                                      </Button>
                                    </motion.div>
                                    <div className="absolute bottom-2 left-2">
                                      <Badge className="bg-green-500/90 text-white text-xs">
                                        Nouveau
                                      </Badge>
                                    </div>
                                  </motion.div>
                                ))}
                              </div>
                            </motion.div>
                          )}

                          {/* Zone d'upload modernisée */}
                          <motion.div
                            className="border-2 border-dashed border-purple-300 dark:border-purple-700 rounded-xl p-8 text-center cursor-pointer hover:border-purple-400 dark:hover:border-purple-600 transition-all duration-300 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/50 dark:to-pink-950/50 hover:from-purple-100 hover:to-pink-100 dark:hover:from-purple-900/50 dark:hover:to-pink-900/50"
                            onClick={() => fileInputRefs.current[story.id]?.click()}
                            whileHover={{ scale: 1.02, y: -3 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <motion.div
                              animate={{ y: [0, -10, 0] }}
                              transition={{ duration: 2, repeat: Infinity }}
                            >
                              <ImageIcon size={48} className="mx-auto mb-4 text-purple-500" />
                            </motion.div>
                            <p className="text-slate-700 dark:text-slate-300 font-medium mb-2">
                              Cliquez pour uploader des images
                            </p>
                            <div className="space-y-1 text-sm text-slate-500 dark:text-slate-400">
                              <p>1 image = Affichage unique • 2+ images = Carrousel automatique</p>
                              <p>Formats acceptés: JPG, PNG, WebP • Sélection multiple possible</p>
                            </div>
                            <input
                              ref={(el) => { fileInputRefs.current[story.id] = el; }}
                              type="file"
                              accept="image/*"
                              multiple={true}
                              className="hidden"
                              onChange={(e) => handleImageUpload(story.id, e.target.files)}
                            />
                          </motion.div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>

      <BackToTop />
    </div>
  );
}
