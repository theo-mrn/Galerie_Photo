import { NextRequest, NextResponse } from "next/server";
import { put, list, del } from '@vercel/blob';

const CONFIG_BLOB_PATH = 'config/gallery-config.json';

interface PhotoStory {
  id: number;
  title: string;
  description: string;
  imageUrl: string | string[];
  location: string;
  displayType: "single" | "carousel";
}

interface GalleryConfig {
  heroImage: string;
  photoStories: PhotoStory[];
  lastUpdated: string;
}

// GET - Charger la configuration
export async function GET() {
  try {
    // Lister les blobs pour trouver notre fichier de config
    const { blobs } = await list();
    const configBlob = blobs.find(blob => blob.pathname === CONFIG_BLOB_PATH);

    if (!configBlob) {
      // Retourner une configuration par défaut si aucune n'existe
      return NextResponse.json({
        heroImage: "/images/hero/hero-default.jpg",
        photoStories: [],
        lastUpdated: new Date().toISOString()
      });
    }

    // Récupérer le contenu du blob
    const response = await fetch(configBlob.url);
    const config = await response.json();

    return NextResponse.json(config);

  } catch (error) {
    console.error("Erreur lors du chargement de la configuration:", error);
    return NextResponse.json(
      { error: "Erreur lors du chargement de la configuration" },
      { status: 500 }
    );
  }
}

// POST - Sauvegarder la configuration
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const config: GalleryConfig = {
      ...body,
      lastUpdated: new Date().toISOString()
    };

    // Convertir la configuration en Blob
    const configBlob = new Blob([JSON.stringify(config, null, 2)], {
      type: 'application/json',
    });

    // Vérifier si un fichier de config existe déjà
    const { blobs } = await list();
    const existingConfig = blobs.find(blob => blob.pathname === CONFIG_BLOB_PATH);

    // Si un fichier existe, le supprimer
    if (existingConfig) {
      await del(existingConfig.url);
    }

    // Uploader la nouvelle configuration
    await put(CONFIG_BLOB_PATH, configBlob, { 
      access: 'public'
    });
    
    return NextResponse.json({
      success: true,
      message: "Configuration sauvegardée avec succès"
    });

  } catch (error) {
    console.error("Erreur lors de la sauvegarde de la configuration:", error);
    return NextResponse.json(
      { error: "Erreur lors de la sauvegarde de la configuration" },
      { status: 500 }
    );
  }
} 