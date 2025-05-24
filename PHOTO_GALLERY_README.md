# Système de Galerie Photo avec Édition

## Vue d'ensemble

Ce système permet de gérer une galerie photo avec une interface d'édition complète. Les images sont stockées de manière sécurisée dans Vercel Blob Storage, offrant une solution de stockage évolutive et performante.

## Structure des fichiers

```
src/app/photo/
├── page.tsx              # Page principale de la galerie
├── edit/
│   └── page.tsx          # Page d'édition
└── api/
    ├── upload/
    │   └── route.ts      # API pour l'upload d'images
    └── delete-image/
        └── route.ts      # API pour la suppression d'images

src/lib/
└── blob-storage.ts       # Utilitaires pour Vercel Blob Storage
```

## Fonctionnalités

### Page Galerie (`/photo`)
- Affichage des histoires de voyage avec images
- Support pour images uniques ou carrousels
- Animations et transitions fluides
- Bouton d'édition flottant pour accéder à l'interface d'administration

### Page d'Édition (`/photo/edit`)
- **Gestion de l'image de couverture** : Upload d'une nouvelle image hero
- **Gestion des histoires** :
  - Modification du titre, description et localisation
  - Choix du type d'affichage (image unique ou carrousel)
  - Upload d'images pour chaque section individuellement
  - Ajout/suppression d'histoires
- **Prévisualisation** : Aperçu en temps réel des modifications
- **Sauvegarde** : Upload automatique des images vers Vercel Blob Storage

### Stockage des Images (Vercel Blob)
- Stockage sécurisé et évolutif des images
- URLs publiques pour un accès rapide
- Organisation automatique par dossiers virtuels
- Suppression facile des images inutilisées

## Utilisation

### 1. Configuration
- Assurez-vous d'avoir configuré les variables d'environnement pour Vercel Blob :
  ```
  BLOB_READ_WRITE_TOKEN=votre_token_ici
  ```

### 2. Accéder à l'édition
- Visitez `/photo` pour voir la galerie
- Cliquez sur le bouton "Éditer" en bas à droite
- Ou accédez directement à `/photo/edit`

### 3. Modifier l'image de couverture
- Dans la section "Image de couverture"
- Cliquez sur la zone d'upload pour sélectionner une nouvelle image
- L'aperçu s'affiche immédiatement

### 4. Gérer les histoires
- Modifiez le titre, la description et la localisation
- Choisissez le type d'affichage :
  - **Image unique** : Une seule image par histoire
  - **Carrousel** : Plusieurs images avec navigation
- Uploadez des images en cliquant sur la zone d'upload
- Supprimez des images avec le bouton X

### 5. Ajouter une nouvelle histoire
- Cliquez sur "Ajouter une histoire"
- Remplissez les informations
- Uploadez les images

### 6. Sauvegarder
- Cliquez sur "Sauvegarder" pour uploader toutes les images
- Les images sont automatiquement stockées dans Vercel Blob
- Retournez à la galerie avec "Aperçu"

## Organisation des images dans Vercel Blob

Les images sont organisées avec des préfixes de dossiers virtuels :

- `hero/` : Images de couverture
- `stories/` : Images des histoires

## Types de fichiers supportés

- JPG/JPEG
- PNG
- WebP

## Sécurité

- Validation côté serveur des types de fichiers
- Noms de fichiers sécurisés (caractères spéciaux supprimés)
- Timestamps pour éviter les conflits de noms
- Stockage sécurisé via Vercel Blob

## Développement

### Structure des données

```typescript
interface PhotoStory {
  id: number;
  title: string;
  description: string;
  imageUrl: string | string[];  // URL Vercel Blob pour l'image
  location: string;
  displayType: "single" | "carousel";
}
```

## Dépannage

### Images ne s'affichent pas
- Vérifiez que les URLs Vercel Blob sont correctes
- Vérifiez les permissions d'accès aux blobs
- Consultez la console pour les erreurs

### Upload échoue
- Vérifiez que le token Vercel Blob est correctement configuré
- Vérifiez les limites de taille de fichier
- Consultez les logs pour plus de détails 