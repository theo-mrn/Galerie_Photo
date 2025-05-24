# Système de Galerie Photo avec Édition

## Vue d'ensemble

Ce système permet de gérer une galerie photo avec une interface d'édition complète. Les utilisateurs peuvent uploader des images qui sont stockées localement dans `public/images/` et organisées par sections.

## Structure des fichiers

```
src/app/photo/
├── page.tsx              # Page principale de la galerie
├── edit/
│   └── page.tsx          # Page d'édition
└── api/upload/
    └── route.ts          # API pour l'upload d'images

public/images/
├── hero/                 # Images de couverture
├── stories/              # Images des histoires de voyage
└── story-{id}/          # Images spécifiques à chaque histoire
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
- **Sauvegarde** : Upload automatique des images vers le serveur

### API Upload (`/api/upload`)
- Upload sécurisé des images
- Validation des types de fichiers (images uniquement)
- Génération de noms de fichiers uniques
- Organisation automatique par dossiers

## Utilisation

### 1. Accéder à l'édition
- Visitez `/photo` pour voir la galerie
- Cliquez sur le bouton "Éditer" en bas à droite
- Ou accédez directement à `/photo/edit`

### 2. Modifier l'image de couverture
- Dans la section "Image de couverture"
- Cliquez sur la zone d'upload pour sélectionner une nouvelle image
- L'aperçu s'affiche immédiatement

### 3. Gérer les histoires
- Modifiez le titre, la description et la localisation
- Choisissez le type d'affichage :
  - **Image unique** : Une seule image par histoire
  - **Carrousel** : Plusieurs images avec navigation
- Uploadez des images en cliquant sur la zone d'upload
- Supprimez des images avec le bouton X

### 4. Ajouter une nouvelle histoire
- Cliquez sur "Ajouter une histoire"
- Remplissez les informations
- Uploadez les images

### 5. Sauvegarder
- Cliquez sur "Sauvegarder" pour uploader toutes les images
- Les images sont automatiquement organisées dans les bons dossiers
- Retournez à la galerie avec "Aperçu"

## Organisation des images

Les images sont automatiquement organisées dans `public/images/` :

- `hero/` : Images de couverture
- `stories/` : Images par défaut des histoires
- `story-{id}/` : Images spécifiques à chaque histoire (ex: `story-1/`, `story-2/`)

## Types de fichiers supportés

- JPG/JPEG
- PNG
- WebP

## Sécurité

- Validation côté serveur des types de fichiers
- Noms de fichiers sécurisés (caractères spéciaux supprimés)
- Timestamps pour éviter les conflits de noms

## Développement

### Ajouter de nouvelles fonctionnalités

1. **Nouveaux champs** : Modifiez l'interface `PhotoStory` dans les deux pages
2. **Nouveaux types d'affichage** : Ajoutez des options dans `displayType`
3. **Validation** : Modifiez l'API upload pour de nouvelles règles

### Structure des données

```typescript
interface PhotoStory {
  id: number;
  title: string;
  description: string;
  imageUrl: string | string[];  // URL unique ou array pour carrousel
  location: string;
  displayType: "single" | "carousel";
}
```

## Dépannage

### Images ne s'affichent pas
- Vérifiez que les dossiers existent dans `public/images/`
- Vérifiez les permissions de fichiers
- Consultez la console pour les erreurs

### Upload échoue
- Vérifiez la taille des fichiers (limite serveur)
- Vérifiez les permissions d'écriture sur `public/images/`
- Consultez les logs serveur

### Erreurs de build
- Vérifiez que tous les composants UI sont installés
- Vérifiez les imports des icônes Lucide React 