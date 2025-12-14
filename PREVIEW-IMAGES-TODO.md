# Preview Images to Generate

This document lists all the preview images that need to be generated for format option placeholders.

## Format Options by Combination

### 1 Pet + 1 Owner (5 formats)
- `/placeholders/1pet-1owner-side-by-side.png` - Side by Side
- `/placeholders/1pet-1owner-pet-in-front.png` - Pet in Front
- `/placeholders/1pet-1owner-owner-holding.png` - Owner Holding *best under 20 lbs*
- `/placeholders/1pet-1owner-seated-together.png` - Seated Together
- `/placeholders/1pet-1owner-pet-beside-owner.png` - Pet Beside Owner

### 2 Pets + 1 Owner (5 formats)
- `/placeholders/2pets-1owner-pets-flanking.png` - Pets Flanking
- `/placeholders/2pets-1owner-pets-in-front.png` - Pets in Front
- `/placeholders/2pets-1owner-owner-holding-both.png` - Owner Holding Both
- `/placeholders/2pets-1owner-seated-group.png` - Seated Group
- `/placeholders/2pets-1owner-pets-stacked.png` - Pets Stacked

### 1 Pet + 2 Owners (5 formats)
- `/placeholders/1pet-2owners-owners-flanking.png` - Owners Flanking
- `/placeholders/1pet-2owners-pet-in-front-owners.png` - Pet in Front
- `/placeholders/1pet-2owners-owners-holding.png` - Owners Holding
- `/placeholders/1pet-2owners-seated-family.png` - Seated Family
- `/placeholders/1pet-2owners-pet-between.png` - Pet Between

### 2 Pets + 2 Owners (5 formats)
- `/placeholders/2pets-2owners-balanced-group.png` - Balanced Group
- `/placeholders/2pets-2owners-pets-center.png` - Pets Center
- `/placeholders/2pets-2owners-owners-center.png` - Owners Center
- `/placeholders/2pets-2owners-seated-family-group.png` - Seated Family Group
- `/placeholders/2pets-2owners-mixed-formation.png` - Mixed Formation

### 3+ Pets (with or without owners) (5 formats)
- `/placeholders/multiple-pets-group-formation.png` - Group Formation
- `/placeholders/multiple-pets-tiered-arrangement.png` - Tiered Arrangement
- `/placeholders/multiple-pets-triangle-formation.png` - Triangle Formation
- `/placeholders/multiple-pets-line-formation.png` - Line Formation
- `/placeholders/multiple-pets-natural-group.png` - Natural Group

## Theme Preview Images (20 themes)
- `/theme-previews/renaissance-royal.png` - Renaissance Royal
- `/theme-previews/nasa-astronaut.png` - NASA Astronaut
- `/theme-previews/disney-pixar.png` - Disney Pixar
- `/theme-previews/marvel-superhero.png` - Marvel Superhero
- `/theme-previews/victorian.png` - Victorian Gentleman/Lady
- `/theme-previews/cyberpunk.png` - Cyberpunk
- `/theme-previews/cowboy.png` - Cowboy
- `/theme-previews/pirate-captain.png` - Pirate Captain
- `/theme-previews/rockstar.png` - Rockstar
- `/theme-previews/harry-potter-wizard.png` - Harry Potter Wizard
- `/theme-previews/christmas-elf.png` - Christmas Elf
- `/theme-previews/steampunk.png` - Steampunk
- `/theme-previews/samurai.png` - Samurai
- `/theme-previews/1920s-gangster.png` - 1920s Gangster
- `/theme-previews/hollywood-movie-star.png` - Hollywood Movie Star
- `/theme-previews/ballerina.png` - Ballerina
- `/theme-previews/general-military.png` - General/Military
- `/theme-previews/wild-west-sheriff.png` - Wild West Sheriff
- `/theme-previews/king-queen-throne.png` - King/Queen on Throne
- `/theme-previews/addams-family-gothic.png` - Addams Family Gothic

## Total: 25 Format Preview Images + 20 Theme Preview Images = 45 Total Images

## Image Specifications
- Format: PNG
- Size: 300x300px (square, 1:1 aspect ratio)
- Style: Clean, professional preview showing the composition style
- Background: Light gray or white
- Content: Simple line art or silhouette showing the arrangement

## Implementation Notes
- Currently using placeholder icons (📷 for formats, 🎨 for themes) in the UI
- Format images should be placed in `/public/placeholders/` directory
- Theme images should be placed in `/public/theme-previews/` directory
- Once images are generated, uncomment the Image component in:
  - `src/components/MultiSubjectUpload.tsx` (line ~520) - format previews
  - `src/components/UploadForm.tsx` (line ~870) - format previews
  - `src/components/UploadForm.tsx` (line ~960) - theme previews
- **IMPORTANT**: Theme preview images must match the ad pictures exactly to ensure consistency when users request these themes
