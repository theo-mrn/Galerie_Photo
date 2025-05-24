"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Image from "next/image";
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
  ImageIcon
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
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ imageUrl: imageToDelete }),
        });
      } catch (error) {
        console.error("Erreur lors de la suppression du fichier:", error);
      }
    }

    setPhotoStories(prev => prev.map(story => {
      if (story.id !== storyId) return story;

      let newImageUrl: string | string[];
      if (Array.isArray(story.imageUrl)) {
        const updatedImages = story.imageUrl.filter((_, index) => index !== imageIndex);
        newImageUrl = updatedImages.length === 1 ? updatedImages[0] : updatedImages;
      } else {
        // Si c'est une image unique, on la supprime complètement
        newImageUrl = "";
      }

      // Recalculer le type d'affichage
      const remainingImages = Array.isArray(newImageUrl) ? newImageUrl.length : (newImageUrl ? 1 : 0);
      const pendingImages = uploadedImages[storyId]?.length || 0;
      const totalImages = remainingImages + pendingImages;
      const newDisplayType: "single" | "carousel" = totalImages > 1 ? "carousel" : "single";

      if (story.displayType !== newDisplayType) {
        toast.info(`Type d'affichage changé automatiquement en ${newDisplayType === "carousel" ? "carrousel" : "image unique"}`);
      }

      return {
        ...story,
        imageUrl: newImageUrl,
        displayType: newDisplayType
      };
    }));

    toast.success("Image supprimée définitivement");
  };

  // Supprimer une image uploadée
  const removeUploadedImage = (storyId: number, index: number) => {
    setUploadedImages(prev => {
      const updatedImages = {
        ...prev,
        [storyId]: prev[storyId]?.filter((_, i) => i !== index) || []
      };

      // Recalculer le type d'affichage après suppression
      const story = photoStories.find(s => s.id === storyId);
      if (story) {
        const currentImages = Array.isArray(story.imageUrl) ? story.imageUrl.length : (story.imageUrl ? 1 : 0);
        const totalImages = currentImages + updatedImages[storyId].length;
        
        const newDisplayType: "single" | "carousel" = totalImages > 1 ? "carousel" : "single";
        if (story.displayType !== newDisplayType) {
          setPhotoStories(prevStories => prevStories.map(s => 
            s.id === storyId ? { ...s, displayType: newDisplayType } : s
          ));
          toast.info(`Type d'affichage changé automatiquement en ${newDisplayType === "carousel" ? "carrousel" : "image unique"}`);
        }
      }

      return updatedImages;
    });
    
    toast.info("Image supprimée de la liste d'upload");
  };

  // Supprimer l'image hero existante
  const removeExistingHeroImage = async () => {
    if (heroImage && !heroImage.includes('default') && !heroImage.includes('placeholder')) {
      try {
        await fetch('/api/delete-image', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ imageUrl: heroImage }),
        });
      } catch (error) {
        console.error("Erreur lors de la suppression du fichier hero:", error);
      }
    }

    setHeroImage("/images/hero/hero-default.jpg");
    toast.success("Image de couverture supprimée");
  };

  // Supprimer l'image hero uploadée (en attente)
  const removeHeroImage = () => {
    if (heroUploadedImage) {
      URL.revokeObjectURL(heroUploadedImage.preview);
      setHeroUploadedImage(null);
      toast.info("Image de couverture supprimée de la liste d'upload");
    }
  };

  // Mettre à jour les informations d'une histoire
  const updateStory = <K extends keyof PhotoStory>(id: number, field: K, value: PhotoStory[K]) => {
    setPhotoStories(prev => prev.map(story => 
      story.id === id ? { ...story, [field]: value } : story
    ));
  };

  // Ajouter une nouvelle histoire
  const addNewStory = () => {
    const newId = Math.max(...photoStories.map(s => s.id)) + 1;
    const newStory: PhotoStory = {
      id: newId,
      title: "Nouvelle destination",
      description: "Décrivez votre expérience...",
      imageUrl: "/images/placeholder.jpg",
      location: "Ville, Pays",
      displayType: "single"
    };
    setPhotoStories(prev => [...prev, newStory]);
    toast.success("Nouvelle histoire ajoutée");
  };

  // Supprimer une histoire
  const deleteStory = (id: number) => {
    const story = photoStories.find(s => s.id === id);
    setPhotoStories(prev => prev.filter(story => story.id !== id));
    setUploadedImages(prev => {
      const newImages = { ...prev };
      delete newImages[id];
      return newImages;
    });
    toast.success(`Histoire "${story?.title}" supprimée`);
  };

  // Sauvegarder toutes les modifications
  const saveChanges = async () => {
    setIsUploading(true);
    const loadingToast = toast.loading("Sauvegarde en cours...");
    
    try {
      // Upload de l'image hero si elle a été modifiée
      let newHeroUrl = heroImage;
      if (heroUploadedImage) {
        toast.loading("Upload de l'image de couverture...", { id: loadingToast });
        newHeroUrl = await uploadImage(heroUploadedImage.file, "hero");
        setHeroImage(newHeroUrl);
        setHeroUploadedImage(null);
      }

      // Upload des images pour chaque histoire
      const updatedStories = await Promise.all(
        photoStories.map(async (story) => {
          const storyImages = uploadedImages[story.id] || [];
          
          // Si pas de nouvelles images à uploader, retourner l'histoire telle quelle
          if (storyImages.length === 0) return story;

          toast.loading(`Upload des images pour "${story.title}"...`, { id: loadingToast });
          
          const uploadedUrls = await Promise.all(
            storyImages.map(img => uploadImage(img.file, `story-${story.id}`))
          );

          // Combiner les images existantes avec les nouvelles
          const currentUrls = Array.isArray(story.imageUrl) 
            ? story.imageUrl 
            : (story.imageUrl && story.imageUrl !== "" ? [story.imageUrl] : []);
          const allImageUrls = [...currentUrls, ...uploadedUrls];

          // Détecter automatiquement le type d'affichage final
          const finalDisplayType: "single" | "carousel" = allImageUrls.length > 1 ? "carousel" : "single";
          const newImageUrl = allImageUrls.length === 0 
            ? "" 
            : (finalDisplayType === "single" ? allImageUrls[0] : allImageUrls);

          return { 
            ...story, 
            imageUrl: newImageUrl,
            displayType: finalDisplayType
          };
        })
      );

      setPhotoStories(updatedStories);
      setUploadedImages({});

      // Sauvegarder la configuration complète
      toast.loading("Sauvegarde de la configuration...", { id: loadingToast });
      const configResponse = await fetch('/api/gallery-config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          heroImage: newHeroUrl,
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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.push("/photo")}
              >
                <ArrowLeft size={20} />
              </Button>
              <div>
                <h1 className="text-2xl font-bold">Édition de la galerie</h1>
                <p className="text-muted-foreground">Gérez vos photos et histoires de voyage</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => router.push("/photo")}
              >
                <Eye size={16} className="mr-2" />
                Aperçu
              </Button>
              <Button
                onClick={saveChanges}
                disabled={isUploading}
              >
                <Save size={16} className="mr-2" />
                {isUploading ? "Sauvegarde..." : "Sauvegarder"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Section Hero */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera size={20} />
                Image de couverture
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <Label>Image actuelle</Label>
                  <div className="relative aspect-video rounded-lg overflow-hidden border group">
                    <Image
                      src={heroUploadedImage?.preview || heroImage}
                      alt="Image de couverture"
                      fill
                      className="object-contain rounded-lg"
                    />
                    {!heroUploadedImage && heroImage !== "/images/hero/hero-default.jpg" && (
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={removeExistingHeroImage}
                          className="text-white"
                        >
                          <X size={16} className="mr-2" />
                          Supprimer
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
                <div className="space-y-4">
                  <Label>Nouvelle image</Label>
                  <div
                    className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center cursor-pointer hover:border-muted-foreground/50 transition-colors"
                    onClick={() => document.getElementById("hero-upload")?.click()}
                  >
                    <Upload size={32} className="mx-auto mb-4 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Cliquez pour uploader une nouvelle image de couverture
                    </p>
                    <input
                      id="hero-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleHeroImageUpload(e.target.files)}
                    />
                  </div>
                  {heroUploadedImage && (
                    <div className="flex items-center justify-between p-2 bg-muted rounded">
                      <span className="text-sm truncate">{heroUploadedImage.name}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={removeHeroImage}
                      >
                        <X size={16} />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section Histoires */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Histoires de voyage</h2>
              <Button onClick={addNewStory}>
                <Plus size={16} className="mr-2" />
                Ajouter une histoire
              </Button>
            </div>

            {photoStories.map((story) => (
              <Card key={story.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <MapPin size={20} />
                      Histoire #{story.id}
                    </CardTitle>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteStory(story.id)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Informations de base */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor={`title-${story.id}`}>Titre</Label>
                      <Input
                        id={`title-${story.id}`}
                        value={story.title}
                        onChange={(e) => updateStory(story.id, "title", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor={`location-${story.id}`}>Localisation</Label>
                      <Input
                        id={`location-${story.id}`}
                        value={story.location}
                        onChange={(e) => updateStory(story.id, "location", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`description-${story.id}`}>Description</Label>
                    <Textarea
                      id={`description-${story.id}`}
                      value={story.description}
                      onChange={(e) => updateStory(story.id, "description", e.target.value)}
                      rows={3}
                    />
                  </div>

                  {/* Type d'affichage - Indicateur automatique */}
                  <div className="space-y-2">
                    <Label>Type d&apos;affichage (automatique)</Label>
                    <div className="flex items-center gap-2">
                      <Badge variant={story.displayType === "single" ? "default" : "secondary"}>
                        {story.displayType === "single" ? "Image unique" : "Carrousel"}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {story.displayType === "single" 
                          ? "1 image → Affichage unique" 
                          : "Plusieurs images → Carrousel automatique"
                        }
                      </span>
                    </div>
                  </div>

                  <Separator />

                  {/* Gestion des images */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label>Images</Label>
                      <Badge variant="secondary">
                        {Array.isArray(story.imageUrl) ? story.imageUrl.length : (story.imageUrl ? 1 : 0)} image(s) actuelle(s)
                        {uploadedImages[story.id] && uploadedImages[story.id].length > 0 && 
                          ` + ${uploadedImages[story.id].length} à ajouter`
                        }
                      </Badge>
                    </div>

                    {/* Images actuelles */}
                    {Array.isArray(story.imageUrl) ? (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {story.imageUrl.map((url, imgIndex) => (
                          <div key={imgIndex} className="relative aspect-square rounded-lg overflow-hidden border group">
                            <Image
                              src={url}
                              alt={`${story.title} - Image ${imgIndex + 1}`}
                              fill
                              className="object-contain rounded-lg"
                            />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => removeExistingImage(story.id, imgIndex)}
                                className="text-white"
                              >
                                <X size={16} />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : story.imageUrl && story.imageUrl !== "" ? (
                      <div className="relative aspect-video rounded-lg overflow-hidden border max-w-md group">
                        <Image
                          src={story.imageUrl}
                          alt={story.title}
                          fill
                          className="object-contain rounded-lg"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => removeExistingImage(story.id, 0)}
                            className="text-white"
                          >
                            <X size={16} />
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <ImageIcon size={48} className="mx-auto mb-2 opacity-50" />
                        <p>Aucune image pour cette histoire</p>
                      </div>
                    )}

                    {/* Nouvelles images uploadées */}
                    {uploadedImages[story.id] && uploadedImages[story.id].length > 0 && (
                      <div className="space-y-2">
                        <Label className="text-sm text-muted-foreground">Nouvelles images à ajouter</Label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {uploadedImages[story.id].map((img, imgIndex) => (
                            <div key={imgIndex} className="relative aspect-square rounded-lg overflow-hidden border">
                              <Image
                                src={img.preview}
                                alt={img.name}
                                fill
                                className="object-contain rounded-lg"
                              />
                              <Button
                                variant="destructive"
                                size="sm"
                                className="absolute top-2 right-2"
                                onClick={() => removeUploadedImage(story.id, imgIndex)}
                              >
                                <X size={12} />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Zone d'upload */}
                    <div
                      className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center cursor-pointer hover:border-muted-foreground/50 transition-colors"
                      onClick={() => fileInputRefs.current[story.id]?.click()}
                    >
                      <ImageIcon size={32} className="mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground mb-1">
                        Cliquez pour uploader des images
                      </p>
                      <p className="text-xs text-muted-foreground">
                        1 image = Affichage unique • 2+ images = Carrousel automatique
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Formats acceptés: JPG, PNG, WebP
                      </p>
                      <input
                        ref={(el) => { fileInputRefs.current[story.id] = el; }}
                        type="file"
                        accept="image/*"
                        multiple={true}
                        className="hidden"
                        onChange={(e) => handleImageUpload(story.id, e.target.files)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
