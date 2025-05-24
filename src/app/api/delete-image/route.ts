import { NextRequest, NextResponse } from "next/server";
import { unlink } from "fs/promises";
import path from "path";

export async function DELETE(request: NextRequest) {
  try {
    const { imageUrl } = await request.json();

    if (!imageUrl) {
      return NextResponse.json(
        { error: "URL de l'image requise" },
        { status: 400 }
      );
    }

    // Construire le chemin du fichier à partir de l'URL
    const imagePath = imageUrl.replace(/^\//, ""); // Supprimer le / initial
    const filePath = path.join(process.cwd(), "public", imagePath);

    try {
      await unlink(filePath);
      return NextResponse.json({
        success: true,
        message: "Image supprimée avec succès"
      });
    } catch {
      // Le fichier n'existe peut-être pas, ce n'est pas grave
      console.warn("Fichier non trouvé pour suppression:", filePath);
      return NextResponse.json({
        success: true,
        message: "Image déjà supprimée ou non trouvée"
      });
    }

  } catch (error) {
    console.error("Erreur lors de la suppression de l'image:", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression de l'image" },
      { status: 500 }
    );
  }
} 