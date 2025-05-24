import { del, put } from '@vercel/blob';

export async function uploadImage(file: File, folder: string = 'stories'): Promise<string> {
  try {
    // Créer un nom de fichier unique avec timestamp
    const timestamp = Date.now();
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const fileName = `${folder}/${timestamp}_${originalName}`;

    // Upload vers Vercel Blob
    const { url } = await put(fileName, file, { access: 'public' });
    return url;
  } catch (error) {
    console.error('Erreur lors de l\'upload vers Vercel Blob:', error);
    throw error;
  }
}

export async function deleteImage(url: string): Promise<void> {
  try {
    await del(url);
  } catch (error) {
    console.error('Erreur lors de la suppression depuis Vercel Blob:', error);
    throw error;
  }
} 