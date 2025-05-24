import { NextRequest, NextResponse } from "next/server";
import { writeFile, readFile } from "fs/promises";
import path from "path";

const CONFIG_FILE = path.join(process.cwd(), "public", "images", "gallery-config.json");

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
    const configData = await readFile(CONFIG_FILE, "utf-8");
    const config: GalleryConfig = JSON.parse(configData);
    return NextResponse.json(config);
  } catch {
    // Fichier n'existe pas, retourner la config par défaut
    const defaultConfig: GalleryConfig = {
      heroImage: "/images/hero/hero-default.jpg",
      photoStories: [
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
      ],
      lastUpdated: new Date().toISOString()
    };
    return NextResponse.json(defaultConfig);
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

    await writeFile(CONFIG_FILE, JSON.stringify(config, null, 2));
    
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