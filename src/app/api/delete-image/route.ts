import { NextRequest, NextResponse } from "next/server";
import { deleteImage } from "@/lib/blob-storage";

export async function DELETE(request: NextRequest) {
  try {
    const { imageUrl } = await request.json();

    if (!imageUrl) {
      return NextResponse.json(
        { error: "URL de l'image requise" },
        { status: 400 }
      );
    }

    try {
      await deleteImage(imageUrl);
      return NextResponse.json({
        success: true,
        message: "Image supprimée avec succès"
      });
    } catch (error) {
      console.error("Erreur lors de la suppression de l'image:", error);
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