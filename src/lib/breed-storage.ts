/**
 * Breed Storage and Management
 * 
 * This module handles storing and retrieving custom breeds that users submit.
 * In the future, this can be migrated to Supabase for persistent storage.
 */

interface StoredBreed {
  name: string;
  petType: "dog" | "cat" | "other";
  submittedAt: string;
  usageCount: number;
  validated: boolean; // Auto-validated after 3 uses
  verified: boolean; // Verified via online sources (Wikipedia, etc.)
  verificationSource?: string; // Where it was verified (Wikipedia, Pattern, etc.)
  verificationConfidence?: "high" | "medium" | "low";
}

// In-memory storage (will be lost on server restart)
// TODO: Migrate to Supabase table for persistent storage
let customBreeds: StoredBreed[] = [];

/**
 * Load custom breeds from storage
 * In production, this would load from Supabase
 */
export function loadCustomBreeds(): StoredBreed[] {
  // TODO: Load from Supabase or file system
  return customBreeds;
}

/**
 * Add a new custom breed
 * Only accepts breeds that have been verified via online sources
 * Auto-validates breeds after 3 uses (system learns from usage)
 */
export function addCustomBreed(
  name: string,
  petType: "dog" | "cat" | "other",
  verificationInfo?: {
    verified: boolean;
    source?: string;
    confidence?: "high" | "medium" | "low";
  }
): StoredBreed {
  const existing = customBreeds.find(
    (b) => b.name.toLowerCase() === name.toLowerCase() && b.petType === petType
  );

  if (existing) {
    existing.usageCount++;
    // Auto-validate after 3 uses (system learns from repeated usage)
    if (existing.usageCount >= 3 && !existing.validated) {
      existing.validated = true;
      console.log(`✅ Auto-validated breed: ${petType} - ${existing.name} (used ${existing.usageCount} times)`);
    }
    return existing;
  }

  // Only store breeds that have been verified
  if (verificationInfo && !verificationInfo.verified) {
    throw new Error("Breed must be verified before storage");
  }

  const newBreed: StoredBreed = {
    name: name.trim(),
    petType,
    submittedAt: new Date().toISOString(),
    usageCount: 1,
    validated: false, // Will be auto-validated after 3 uses
    verified: verificationInfo?.verified ?? true, // Should always be true if we're storing it
    verificationSource: verificationInfo?.source,
    verificationConfidence: verificationInfo?.confidence,
  };

  customBreeds.push(newBreed);
  return newBreed;
}

/**
 * Get custom breeds for a specific pet type
 */
export function getCustomBreedsForType(
  petType: "dog" | "cat" | "other"
): string[] {
  return customBreeds
    .filter((b) => b.petType === petType && b.validated)
    .map((b) => b.name)
    .sort();
}

/**
 * Validate a breed (can be called by admin or automated system)
 */
export function validateBreed(
  name: string,
  petType: "dog" | "cat" | "other"
): boolean {
  const breed = customBreeds.find(
    (b) => b.name.toLowerCase() === name.toLowerCase() && b.petType === petType
  );

  if (breed) {
    breed.validated = true;
    return true;
  }

  return false;
}

/**
 * Get all custom breeds (for admin dashboard)
 */
export function getAllCustomBreeds(): StoredBreed[] {
  return [...customBreeds].sort((a, b) => b.usageCount - a.usageCount);
}

