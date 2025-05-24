import { NextResponse } from "next/server";
import { readdir, stat } from "fs/promises";
import path from "path";

export async function GET() {
  try {
    const heroDir = path.join(process.cwd(), "public", "images", "hero");
    
    try {
      const files = await readdir(heroDir);
      const imageFiles = files.filter(file => 
        /\.(jpg|jpeg|png|webp)$/i.test(file)
      );

      if (imageFiles.length === 0) {
        return NextResponse.json({ latestImage: null });
      }

      // Trier par date de modification (plus récent en premier)
      const filesWithStats = await Promise.all(
        imageFiles.map(async (file) => {
          const filePath = path.join(heroDir, file);
          const stats = await stat(filePath);
          return {
            name: file,
            mtime: stats.mtime,
            url: `/images/hero/${file}`
          };
        })
      );

      filesWithStats.sort((a, b) => b.mtime.getTime() - a.mtime.getTime());
      
      return NextResponse.json({
        latestImage: filesWithStats[0].url,
        allImages: filesWithStats.map(f => f.url)
      });

    } catch {
      // Le dossier n'existe pas encore
      return NextResponse.json({ latestImage: null });
    }

  } catch (error) {
    console.error("Erreur lors de la lecture des images hero:", error);
    return NextResponse.json(
      { error: "Erreur lors de la lecture des images" },
      { status: 500 }
    );
  }
} 