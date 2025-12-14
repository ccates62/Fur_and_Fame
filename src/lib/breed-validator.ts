/**
 * Breed Validation Utility
 * 
 * Verifies that submitted breeds/animals actually exist by cross-referencing
 * against online sources (Wikipedia, breed databases, etc.)
 */

interface ValidationResult {
  isValid: boolean;
  confidence: "high" | "medium" | "low";
  source?: string;
  reason?: string;
  suggestedSpelling?: string; // For spelling corrections
}

/**
 * Validate a breed/animal name against online sources
 * Uses Wikipedia API and pattern matching to verify existence
 * Includes fuzzy matching for spelling tolerance
 */
export async function validateBreedName(
  breedName: string,
  petType: "dog" | "cat" | "other"
): Promise<ValidationResult> {
  const cleanedName = breedName.trim();
  
  // Step 1: Basic format validation
  if (!isValidFormat(cleanedName)) {
    return {
      isValid: false,
      confidence: "high",
      reason: "Invalid format - must start with a letter and contain only letters, spaces, hyphens, and apostrophes",
    };
  }

  // Step 2: Check against known invalid patterns
  if (isInvalidPattern(cleanedName)) {
    return {
      isValid: false,
      confidence: "high",
      reason: "Pattern matches known invalid entries",
    };
  }

  // Step 2.5: Check for spelling errors against known breeds (fuzzy matching)
  const spellingCheck = checkSpellingAgainstKnownBreeds(cleanedName, petType);
  if (spellingCheck.isValid) {
    // If it's a close match, accept it but note the suggested spelling
    return {
      isValid: true,
      confidence: spellingCheck.confidence,
      source: "Fuzzy Match (Spelling Tolerance)",
      suggestedSpelling: spellingCheck.suggestedSpelling,
    };
  }

  // Step 3: Verify against Wikipedia (free, no API key needed)
  try {
    const wikiResult = await verifyViaWikipedia(cleanedName, petType);
    if (wikiResult.isValid) {
      return wikiResult;
    }
  } catch (error) {
    console.log("Wikipedia verification failed (non-blocking):", error);
  }

  // Step 4: Fallback - check against common breed patterns
  const patternResult = verifyViaPatterns(cleanedName, petType);
  if (patternResult.isValid) {
    return patternResult;
  }

  // Step 5: If all checks fail, but we found a close spelling match, suggest it
  if (spellingCheck.suggestedSpelling) {
    return {
      isValid: false,
      confidence: "medium",
      reason: `Could not verify breed. Did you mean "${spellingCheck.suggestedSpelling}"?`,
      suggestedSpelling: spellingCheck.suggestedSpelling,
    };
  }

  // Step 6: If all checks fail, reject
  return {
    isValid: false,
    confidence: "high",
    reason: "Could not verify breed/animal exists in known databases",
  };
}

/**
 * Basic format validation
 */
function isValidFormat(name: string): boolean {
  // Must start with a letter
  if (!/^[a-zA-Z]/.test(name)) {
    return false;
  }

  // Can contain letters, spaces, hyphens, apostrophes, and numbers (for mixed breeds like "Labrador Retriever Mix")
  if (!/^[a-zA-Z0-9\s\-']+$/.test(name)) {
    return false;
  }

  // Must be between 2 and 50 characters
  if (name.length < 2 || name.length > 50) {
    return false;
  }

  return true;
}

/**
 * Check for obviously invalid patterns
 */
function isInvalidPattern(name: string): boolean {
  const invalidPatterns = [
    /^test/i,
    /^xxx/i,
    /^asdf/i,
    /^123/i,
    /^qwerty/i,
    /^abc/i,
    /^fake/i,
    /^madeup/i,
    /^random/i,
    /^nonsense/i,
    /^[^a-zA-Z]/i,
    /^.{1}$/i, // Single character
  ];

  return invalidPatterns.some((pattern) => pattern.test(name));
}

/**
 * Verify breed via Wikipedia API
 */
async function verifyViaWikipedia(
  breedName: string,
  petType: "dog" | "cat" | "other"
): Promise<ValidationResult> {
  try {
    // Construct search query
    const searchQuery = encodeURIComponent(
      `${breedName} ${petType === "dog" ? "dog breed" : petType === "cat" ? "cat breed" : "pet animal"}`
    );

    // Use Wikipedia API to search
    const apiUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(breedName)}`;
    
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "User-Agent": "FurAndFame-BreedValidator/1.0",
      },
    });

    if (response.ok) {
      const data = await response.json();
      
      // Check if page exists and is not a disambiguation page
      if (data.type === "standard" && !data.title.includes("(disambiguation)")) {
        // Verify the content mentions it's a breed/animal
        const extract = (data.extract || "").toLowerCase();
        const title = (data.title || "").toLowerCase();
        
        const breedKeywords = ["breed", "dog", "cat", "animal", "pet", "species"];
        const hasBreedContext = breedKeywords.some((keyword) => 
          extract.includes(keyword) || title.includes(keyword)
        );

        if (hasBreedContext) {
          return {
            isValid: true,
            confidence: "high",
            source: "Wikipedia",
          };
        }
      }
    }

    // Try alternative search if direct page doesn't exist
    const searchUrl = `https://en.wikipedia.org/api/rest_v1/page/search/${searchQuery}?limit=3`;
    const searchResponse = await fetch(searchUrl, {
      headers: {
        "User-Agent": "FurAndFame-BreedValidator/1.0",
      },
    });

    if (searchResponse.ok) {
      const searchData = await searchResponse.json();
      if (searchData.pages && searchData.pages.length > 0) {
        // Check if any result closely matches
        const matches = searchData.pages.filter((page: any) => {
          const pageTitle = page.title.toLowerCase();
          const searchName = breedName.toLowerCase();
          return pageTitle.includes(searchName) || searchName.includes(pageTitle.split(" ")[0]);
        });

        if (matches.length > 0) {
          return {
            isValid: true,
            confidence: "medium",
            source: "Wikipedia Search",
          };
        }
      }
    }

    return {
      isValid: false,
      confidence: "medium",
      reason: "Not found in Wikipedia",
    };
  } catch (error) {
    console.error("Wikipedia verification error:", error);
    return {
      isValid: false,
      confidence: "low",
      reason: "Wikipedia API error",
    };
  }
}

/**
 * Fallback pattern-based validation
 * Checks against known breed naming patterns
 */
function verifyViaPatterns(
  breedName: string,
  petType: "dog" | "cat" | "other"
): ValidationResult {
  const name = breedName.toLowerCase();

  // Common breed suffixes/patterns
  const dogPatterns = [
    /doodle$/i,
    /poo$/i,
    /mix$/i,
    /terrier$/i,
    /retriever$/i,
    /shepherd$/i,
    /spaniel$/i,
    /hound$/i,
    /bulldog$/i,
    /pinscher$/i,
    /setter$/i,
    /sheepdog$/i,
  ];

  const catPatterns = [
    /shorthair$/i,
    /longhair$/i,
    /rex$/i,
    /bobtail$/i,
    /fold$/i,
    /maine coon/i,
    /persian/i,
    /siamese/i,
  ];

  const otherPatterns = [
    /rabbit$/i,
    /hamster$/i,
    /guinea pig/i,
    /bird$/i,
    /lizard$/i,
    /turtle$/i,
    /ferret$/i,
    /horse$/i,
    /goat$/i,
    /chicken$/i,
    /duck$/i,
    /pig$/i,
    /fish$/i,
    /frog$/i,
  ];

  let patterns: RegExp[] = [];
  if (petType === "dog") {
    patterns = dogPatterns;
  } else if (petType === "cat") {
    patterns = catPatterns;
  } else {
    patterns = otherPatterns;
  }

  // Check if name matches known patterns
  const matchesPattern = patterns.some((pattern) => pattern.test(name));

  // Also check for common breed words in the name
  const commonWords = [
    "mix", "cross", "hybrid", "designer", "purebred", "pedigree",
    "miniature", "toy", "standard", "giant", "dwarf",
  ];
  const hasCommonWord = commonWords.some((word) => name.includes(word));

  if (matchesPattern || hasCommonWord) {
    return {
      isValid: true,
      confidence: "medium",
      source: "Pattern Matching",
    };
  }

  // For "other" category, be more lenient if it's a known animal type
  if (petType === "other") {
    const knownAnimals = [
      "rabbit", "hamster", "guinea pig", "bird", "parrot", "budgie",
      "lizard", "gecko", "turtle", "tortoise", "ferret", "horse",
      "pony", "goat", "chicken", "duck", "pig", "goldfish", "frog",
      "hedgehog", "chinchilla", "rat", "mouse", "gerbil",
    ];
    
    if (knownAnimals.some((animal) => name.includes(animal))) {
      return {
        isValid: true,
        confidence: "medium",
        source: "Known Animal Type",
      };
    }
  }

  return {
    isValid: false,
    confidence: "low",
    reason: "Does not match known breed/animal patterns",
  };
}

/**
 * Calculate Levenshtein distance between two strings
 * Used for fuzzy matching to detect spelling errors
 */
function levenshteinDistance(str1: string, str2: string): number {
  const s1 = str1.toLowerCase();
  const s2 = str2.toLowerCase();
  const matrix: number[][] = [];

  for (let i = 0; i <= s2.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= s1.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= s2.length; i++) {
    for (let j = 1; j <= s1.length; j++) {
      if (s2.charAt(i - 1) === s1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1       // deletion
        );
      }
    }
  }

  return matrix[s2.length][s1.length];
}

/**
 * Check if breed name is a close match to known breeds (spelling tolerance)
 */
function checkSpellingAgainstKnownBreeds(
  breedName: string,
  petType: "dog" | "cat" | "other"
): ValidationResult {
  // Known breed lists (from UploadForm)
  const knownDogBreeds = [
    "Affenpinscher", "Afghan Hound", "Airedale Terrier", "Akita", "Alaskan Malamute",
    "American Bulldog", "American English Coonhound", "American Eskimo Dog", "American Foxhound",
    "American Pit Bull Terrier", "American Staffordshire Terrier", "American Water Spaniel",
    "Anatolian Shepherd Dog", "Australian Cattle Dog", "Australian Shepherd", "Australian Terrier",
    "Basenji", "Basset Hound", "Beagle", "Bearded Collie", "Bedlington Terrier", "Belgian Malinois",
    "Belgian Sheepdog", "Belgian Tervuren", "Bernese Mountain Dog", "Bichon Frise", "Black and Tan Coonhound",
    "Black Russian Terrier", "Bloodhound", "Bluetick Coonhound", "Border Collie", "Border Terrier",
    "Borzoi", "Boston Terrier", "Bouvier des Flandres", "Boxer", "Boykin Spaniel", "Briard",
    "Brittany", "Brussels Griffon", "Bull Terrier", "Bulldog", "Bullmastiff", "Cairn Terrier",
    "Cane Corso", "Cardigan Welsh Corgi", "Cavalier King Charles Spaniel", "Chesapeake Bay Retriever",
    "Chihuahua", "Chinese Crested", "Chinese Shar-Pei", "Chinook", "Chow Chow", "Clumber Spaniel",
    "Cocker Spaniel", "Collie", "Curly-Coated Retriever", "Dachshund", "Dalmatian", "Dandie Dinmont Terrier",
    "Doberman Pinscher", "Dogue de Bordeaux", "English Cocker Spaniel", "English Foxhound",
    "English Setter", "English Springer Spaniel", "English Toy Spaniel", "Field Spaniel", "Finnish Spitz",
    "Flat-Coated Retriever", "French Bulldog", "German Pinscher", "German Shepherd", "German Shorthaired Pointer",
    "German Wirehaired Pointer", "Giant Schnauzer", "Glen of Imaal Terrier", "Golden Retriever",
    "Gordon Setter", "Great Dane", "Great Pyrenees", "Greater Swiss Mountain Dog", "Greyhound",
    "Harrier", "Havanese", "Ibizan Hound", "Icelandic Sheepdog", "Irish Red and White Setter",
    "Irish Setter", "Irish Terrier", "Irish Water Spaniel", "Irish Wolfhound", "Italian Greyhound",
    "Japanese Chin", "Keeshond", "Kerry Blue Terrier", "Komondor", "Kuvasz", "Labrador Retriever",
    "Lakeland Terrier", "Leonberger", "Lhasa Apso", "Lowchen", "Maltese", "Manchester Terrier",
    "Mastiff", "Miniature Bull Terrier", "Miniature Pinscher", "Miniature Schnauzer", "Neapolitan Mastiff",
    "Newfoundland", "Norfolk Terrier", "Norwegian Buhund", "Norwegian Elkhound", "Norwegian Lundehund",
    "Norwich Terrier", "Nova Scotia Duck Tolling Retriever", "Old English Sheepdog", "Otterhound",
    "Papillon", "Parson Russell Terrier", "Pekingese", "Pembroke Welsh Corgi", "Petit Basset Griffon Vendeen",
    "Pharaoh Hound", "Plott", "Pointer", "Pomeranian", "Poodle", "Portuguese Water Dog", "Pug",
    "Puli", "Pumi", "Rat Terrier", "Redbone Coonhound", "Rhodesian Ridgeback", "Rottweiler",
    "Saint Bernard", "Saluki", "Samoyed", "Schipperke", "Scottish Deerhound", "Scottish Terrier",
    "Sealyham Terrier", "Shetland Sheepdog", "Shiba Inu", "Shih Tzu", "Siberian Husky", "Silky Terrier",
    "Smooth Fox Terrier", "Soft Coated Wheaten Terrier", "Spinone Italiano", "Staffordshire Bull Terrier",
    "Standard Schnauzer", "Sussex Spaniel", "Swedish Vallhund", "Tibetan Mastiff", "Tibetan Spaniel",
    "Tibetan Terrier", "Toy Fox Terrier", "Treeing Walker Coonhound", "Vizsla", "Weimaraner",
    "Welsh Springer Spaniel", "West Highland White Terrier", "Whippet", "Wire Fox Terrier",
    "Wirehaired Pointing Griffon", "Xoloitzcuintli", "Yorkshire Terrier",
    "Bernedoodle", "Goldendoodle", "Labradoodle", "Aussiedoodle", "Cavapoo", "Cockapoo", "Doodleman Pinscher",
    "Double Doodle", "Irish Doodle", "Newfypoo", "Pomsky", "Poodle Mix", "Schnoodle", "Sheepadoodle",
    "Whoodle", "Yorkipoo", "Pomski",
    "Puggle", "Maltipoo", "Shihpoo", "Pomchi", "Chiweenie", "Jack Russell Terrier", "Pitbull Mix",
  ];

  const knownCatBreeds = [
    "Domestic Shorthair", "Domestic Longhair", "American Shorthair", "British Shorthair", "Persian",
    "Maine Coon", "Ragdoll", "Siamese", "Bengal", "Russian Blue", "Scottish Fold", "Sphynx",
    "Exotic Shorthair", "Abyssinian", "Birman", "Himalayan", "Norwegian Forest Cat", "Oriental",
    "Tonkinese", "Turkish Angora", "American Bobtail", "American Curl", "American Wirehair", "Angora",
    "Australian Mist", "Balinese", "Bombay", "British Longhair", "Burmese", "Burmilla", "Chartreux",
    "Chausie", "Cornish Rex", "Cymric", "Devon Rex", "Donskoy", "Egyptian Mau", "Havana Brown",
    "Japanese Bobtail", "Korat", "LaPerm", "Manx", "Munchkin", "Ocicat", "Peterbald", "Pixie-Bob",
    "Savannah", "Selkirk Rex", "Siberian", "Singapura", "Snowshoe", "Somali", "Turkish Van",
  ];

  const knownOtherAnimals = [
    "Rabbit", "Hamster", "Guinea Pig", "Bird", "Parrot", "Budgie", "Canary", "Cockatiel", "Lovebird",
    "Finch", "Lizard", "Gecko", "Bearded Dragon", "Iguana", "Chameleon", "Turtle", "Tortoise",
    "Ferrets", "Horse", "Pony", "Goat", "Chicken", "Rooster", "Duck", "Goose", "Pig", "Potbellied Pig",
    "Goldfish", "Betta Fish", "Koi", "Frog", "Toad", "Hedgehog", "Sugar Glider", "Chinchilla",
    "Rat", "Mouse", "Gerbil",
  ];

  // Get the appropriate breed list
  let breedList: string[] = [];
  if (petType === "dog") {
    breedList = knownDogBreeds;
  } else if (petType === "cat") {
    breedList = knownCatBreeds;
  } else {
    breedList = knownOtherAnimals;
  }

  // Check for exact match first (case-insensitive)
  const exactMatch = breedList.find(
    (breed) => breed.toLowerCase() === breedName.toLowerCase()
  );
  if (exactMatch) {
    return {
      isValid: true,
      confidence: "high",
      source: "Exact Match",
    };
  }

  // Check for fuzzy matches (spelling tolerance)
  const normalizedInput = breedName.toLowerCase().trim();
  let bestMatch: { breed: string; distance: number } | null = null;
  const maxDistance = Math.max(2, Math.floor(normalizedInput.length * 0.2)); // Allow up to 20% character difference or 2 chars minimum

  for (const breed of breedList) {
    const normalizedBreed = breed.toLowerCase();
    
    // Calculate Levenshtein distance
    const distance = levenshteinDistance(normalizedInput, normalizedBreed);
    
    // Also check if one string contains the other (for partial matches)
    const containsMatch = normalizedInput.includes(normalizedBreed) || normalizedBreed.includes(normalizedInput);
    
    if (distance <= maxDistance || containsMatch) {
      if (!bestMatch || distance < bestMatch.distance) {
        bestMatch = { breed, distance };
      }
    }
  }

  // If we found a close match, accept it with spelling tolerance
  if (bestMatch && bestMatch.distance <= maxDistance) {
    // If distance is 1-2 characters, it's likely a typo - accept it
    if (bestMatch.distance <= 2) {
      return {
        isValid: true,
        confidence: "high",
        source: "Fuzzy Match (Spelling Tolerance)",
        suggestedSpelling: bestMatch.breed,
      };
    }
    // If distance is 3-4, suggest the correct spelling but still accept
    if (bestMatch.distance <= 4) {
      return {
        isValid: true,
        confidence: "medium",
        source: "Fuzzy Match (Spelling Tolerance)",
        suggestedSpelling: bestMatch.breed,
      };
    }
  }

  // Return suggested spelling if found, but don't auto-accept
  if (bestMatch) {
    return {
      isValid: false,
      confidence: "medium",
      reason: `Could not verify. Did you mean "${bestMatch.breed}"?`,
      suggestedSpelling: bestMatch.breed,
    };
  }

  return {
    isValid: false,
    confidence: "low",
    reason: "No close match found in known breeds",
  };
}

