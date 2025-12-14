/**
 * Content Moderation Utility
 * Filters inappropriate content including curse words, sexual content, and bad gestures
 */

// List of inappropriate words/phrases to filter
const INAPPROPRIATE_WORDS = [
  // Curse words (common profanity)
  'fuck', 'fucking', 'fucked', 'fucker',
  'shit', 'shitting', 'shitted',
  'damn', 'damned', 'dammit',
  'hell', 'hells',
  'ass', 'asses', 'asshole', 'assholes',
  'bitch', 'bitches', 'bitching',
  'bastard', 'bastards',
  'crap', 'crappy',
  'piss', 'pissing', 'pissed',
  'dick', 'dicks', 'dickhead',
  'cock', 'cocks',
  'pussy', 'pussies',
  'tits', 'titties',
  'slut', 'sluts',
  'whore', 'whores',
  'nigger', 'nigga', 'niggas', // Racial slurs
  'fag', 'faggot', 'faggots',
  'retard', 'retarded',
  'gay', 'gays', // Context-dependent, but filtering for safety
  'lesbian', 'lesbians',
  'homo', 'homos',
  'tranny', 'trannies',
  
  // Sexual content
  'sex', 'sexual', 'sexually',
  'porn', 'porno', 'pornography',
  'masturbat', 'masturbation',
  'orgasm', 'orgasms',
  'erotic', 'erotica',
  'nude', 'nudes', 'nudity',
  'naked', 'nakedness',
  'penis', 'penises',
  'vagina', 'vaginas',
  'breast', 'breasts',
  'nipple', 'nipples',
  'cum', 'cums', 'cumming',
  'ejaculat', 'ejaculation',
  'blowjob', 'blowjobs',
  'handjob', 'handjobs',
  'anal', 'anally',
  'oral', 'orally',
  'fetish', 'fetishes',
  'bdsm',
  'kink', 'kinks', 'kinky',
  
  // Violence/threats
  'kill', 'killing', 'killed', 'killer', 'killers',
  'murder', 'murdering', 'murdered', 'murderer',
  'death', 'deaths', 'dead', 'die', 'dies', 'dying',
  'suicide', 'suicidal',
  'bomb', 'bombs', 'bombing',
  'terrorist', 'terrorism',
  'shoot', 'shooting', 'shot', 'shots',
  'gun', 'guns',
  'weapon', 'weapons',
  'knife', 'knives',
  'stab', 'stabbing', 'stabbed',
  'rape', 'raping', 'raped', 'rapist',
  'torture', 'torturing', 'tortured',
  
  // Hate speech
  'hate', 'hating', 'hated',
  'racist', 'racism',
  'nazi', 'nazis',
  'kkk',
  'white power',
  'black power',
  
  // Drug references
  'drug', 'drugs',
  'cocaine', 'coke',
  'heroin',
  'marijuana', 'weed', 'pot',
  'meth', 'methamphetamine',
  'lsd',
  'ecstasy',
  'crack',
  'opioid', 'opioids',
  'pill', 'pills',
  
  // Bad gestures/actions (descriptions)
  'flip off', 'flipping off', 'flipped off',
  'middle finger', 'middle fingers',
  'fuck you', 'f u', 'f u c k',
  'screw you',
  'go to hell',
];

// Patterns for detecting inappropriate content
const INAPPROPRIATE_PATTERNS = [
  /f+u+c+k+/i,
  /s+h+i+t+/i,
  /a+s+s+h+o+l+e+/i,
  /b+i+t+c+h+/i,
  /d+a+m+n+/i,
  /h+e+l+l+/i,
  /c+r+a+p+/i,
  /p+i+s+s+/i,
  /d+i+c+k+/i,
  /c+o+c+k+/i,
  /p+u+s+s+y+/i,
  /t+i+t+s+/i,
  /s+l+u+t+/i,
  /w+h+o+r+e+/i,
  /n+i+g+g+e+r+/i,
  /n+i+g+g+a+/i,
  /f+a+g+/i,
  /r+e+t+a+r+d+/i,
];

/**
 * Check if text contains inappropriate content
 */
export function containsInappropriateContent(text: string): boolean {
  if (!text || typeof text !== 'string') {
    return false;
  }

  const normalizedText = text.toLowerCase().trim();
  
  // Check against word list
  for (const word of INAPPROPRIATE_WORDS) {
    // Use word boundaries to avoid false positives
    const regex = new RegExp(`\\b${word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
    if (regex.test(normalizedText)) {
      return true;
    }
  }
  
  // Check against patterns
  for (const pattern of INAPPROPRIATE_PATTERNS) {
    if (pattern.test(normalizedText)) {
      return true;
    }
  }
  
  // Check for attempts to bypass filters (common obfuscation)
  const obfuscatedPatterns = [
    /[f]+[u]+[c]+[k]+/i,
    /[s]+[h]+[i]+[t]+/i,
    /f\*+u\*+c\*+k/i,
    /s\*+h\*+i\*+t/i,
    /f\s+u\s+c\s+k/i,
    /s\s+h\s+i\s+t/i,
  ];
  
  for (const pattern of obfuscatedPatterns) {
    if (pattern.test(normalizedText)) {
      return true;
    }
  }
  
  return false;
}

/**
 * Filter inappropriate content from text
 * Replaces inappropriate words with asterisks
 */
export function filterInappropriateContent(text: string): string {
  if (!text || typeof text !== 'string') {
    return text;
  }

  let filtered = text;
  
  // Replace inappropriate words
  for (const word of INAPPROPRIATE_WORDS) {
    const regex = new RegExp(`\\b${word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
    filtered = filtered.replace(regex, '*'.repeat(word.length));
  }
  
  // Replace pattern matches
  for (const pattern of INAPPROPRIATE_PATTERNS) {
    filtered = filtered.replace(pattern, (match) => '*'.repeat(match.length));
  }
  
  return filtered;
}

/**
 * Validate user input (name, message, etc.)
 * Returns validation result with error message if invalid
 */
export interface ContentValidationResult {
  isValid: boolean;
  error?: string;
  filteredText?: string;
}

export function validateUserContent(
  text: string,
  fieldName: string = 'content'
): ContentValidationResult {
  if (!text || typeof text !== 'string') {
    return {
      isValid: true, // Empty is valid
      filteredText: '',
    };
  }

  if (containsInappropriateContent(text)) {
    return {
      isValid: false,
      error: `Your ${fieldName} contains inappropriate content. Please remove any profanity, offensive language, or inappropriate references.`,
      filteredText: filterInappropriateContent(text),
    };
  }

  return {
    isValid: true,
    filteredText: text,
  };
}

/**
 * Check if image might contain inappropriate content
 * Note: This is a basic check. For production, consider using an image moderation API
 * like Google Cloud Vision API, AWS Rekognition, or similar services.
 */
export async function validateImageContent(
  file: File
): Promise<ContentValidationResult> {
  // Basic file validation
  if (!file || !(file instanceof File)) {
    return {
      isValid: false,
      error: 'Invalid file provided',
    };
  }

  // Check file type (including HEIC/HEIF and GIF for compatibility with upload route)
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif', 'image/heic', 'image/heif'];
  const fileExtension = file.name.toLowerCase().split(".").pop();
  const isValidType = 
    allowedTypes.includes(file.type.toLowerCase()) ||
    ["jpg", "jpeg", "png", "gif", "webp", "heic", "heif"].includes(fileExtension || "");
  
  if (!isValidType) {
    return {
      isValid: false,
      error: 'Invalid file type. Please upload a JPEG, PNG, GIF, HEIC, or WebP image.',
    };
  }

  // Check file size (max 10MB)
  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    return {
      isValid: false,
      error: 'File size too large. Please upload an image smaller than 10MB.',
    };
  }

  // Note: For actual image content moderation (detecting inappropriate images),
  // you would need to:
  // 1. Send image to a moderation API (Google Cloud Vision, AWS Rekognition, etc.)
  // 2. Check for explicit content, violence, etc.
  // 3. This is a placeholder - implement actual image moderation in production

  return {
    isValid: true,
  };
}

/**
 * Sanitize filename to prevent inappropriate names
 */
export function sanitizeFilename(filename: string): string {
  if (!filename || typeof filename !== 'string') {
    return 'file';
  }

  // Remove path components
  const name = filename.split('/').pop() || filename.split('\\').pop() || 'file';
  
  // Check if filename contains inappropriate content
  if (containsInappropriateContent(name)) {
    // Generate a safe filename
    const ext = name.split('.').pop() || '';
    const timestamp = Date.now();
    return `upload_${timestamp}.${ext}`;
  }
  
  // Remove any potentially dangerous characters
  return name.replace(/[^a-zA-Z0-9._-]/g, '_');
}
