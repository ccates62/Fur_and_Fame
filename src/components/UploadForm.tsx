"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

const STYLES = [
  "Renaissance Royal",
  "NASA Astronaut",
  "Disney Pixar",
  "Marvel Superhero",
  "Victorian Gentleman/Lady",
  "Cyberpunk",
  "Cowboy",
  "Pirate Captain",
  "Rockstar",
  "Harry Potter Wizard",
  "Christmas Elf",
  "Steampunk",
  "Samurai",
  "1920s Gangster",
  "Hollywood Movie Star",
  "Ballerina",
  "General/Military",
  "Wild West Sheriff",
  "King/Queen on Throne",
  "Addams Family Gothic",
];

const DOG_BREEDS = [
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
  // Doodle Breeds
  "Bernedoodle", "Goldendoodle", "Labradoodle", "Aussiedoodle", "Cavapoo", "Cockapoo", "Doodleman Pinscher",
  "Double Doodle", "Irish Doodle", "Newfypoo", "Pomsky", "Poodle Mix", "Schnoodle", "Sheepadoodle",
  "Whoodle", "Yorkipoo", "Pomski",
  // Other Popular Crossbreeds and Designer Dogs
  "Puggle", "Maltipoo", "Shihpoo", "Pomchi", "Chiweenie", "Jack Russell Terrier", "Pitbull Mix",
  "Mixed Breed", "Other"
];

const CAT_BREEDS = [
  // Top 5 Most Common Breeds (at the top)
  "Domestic Shorthair",
  "Domestic Longhair",
  "American Shorthair",
  "British Shorthair",
  "Persian",
  // Other Popular Breeds
  "Maine Coon",
  "Ragdoll",
  "Siamese",
  "Bengal",
  "Russian Blue",
  "Scottish Fold",
  "Sphynx",
  "Exotic Shorthair",
  "Abyssinian",
  "Birman",
  "Himalayan",
  "Norwegian Forest Cat",
  "Oriental",
  "Tonkinese",
  "Turkish Angora",
  "American Bobtail",
  "American Curl",
  "American Wirehair",
  "Angora",
  "Australian Mist",
  "Balinese",
  "Bombay",
  "British Longhair",
  "Burmese",
  "Burmilla",
  "Chartreux",
  "Chausie",
  "Cornish Rex",
  "Cymric",
  "Devon Rex",
  "Donskoy",
  "Egyptian Mau",
  "Havana Brown",
  "Japanese Bobtail",
  "Korat",
  "LaPerm",
  "Manx",
  "Munchkin",
  "Ocicat",
  "Peterbald",
  "Pixie-Bob",
  "Savannah",
  "Selkirk Rex",
  "Siberian",
  "Singapura",
  "Snowshoe",
  "Somali",
  "Turkish Van",
  "Mixed Breed",
  "Other"
];

const OTHER_ANIMALS = [
  "Rabbit", "Hamster", "Guinea Pig", "Bird", "Parrot", "Budgie", "Canary", "Cockatiel", "Lovebird",
  "Finch", "Lizard", "Gecko", "Bearded Dragon", "Iguana", "Chameleon", "Turtle", "Tortoise",
  "Ferrets", "Horse", "Pony", "Goat", "Chicken", "Rooster", "Duck", "Goose", "Pig", "Potbellied Pig",
  "Goldfish", "Betta Fish", "Koi", "Frog", "Toad", "Hedgehog", "Sugar Glider", "Chinchilla",
  "Rat", "Mouse", "Gerbil", "Other"
];

// Subject interface for multi-subject portraits
interface Subject {
  id: number;
  type: "pet" | "person";
  name?: string; // For pets only
  breed?: string; // For pets only
  petType?: "dog" | "cat" | "other"; // For pets only
  sex?: string; // For both
  ethnicity?: string; // For people only
  hairColor?: string; // For people only
  skipDemographics?: boolean; // For people only
  photo: File | null;
  photoPreview: string | null;
  imageUrl?: string; // Uploaded photo URL
}

export default function UploadForm() {
  // Wizard state - ALWAYS starts with "numbers" step
  const [wizardStep, setWizardStep] = useState<"numbers" | "subjects-info" | "portrait-type">("numbers");
  
  // Numbers step state
  const [selectedOwnerCount, setSelectedOwnerCount] = useState<number>(0);
  const [selectedPetCount, setSelectedPetCount] = useState<number>(1);
  
  // Subjects state
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [validationErrors, setValidationErrors] = useState<Record<number, Record<string, boolean>>>({});
  const [breedSearches, setBreedSearches] = useState<Record<number, string>>({});
  const [showBreedLists, setShowBreedLists] = useState<Record<number, boolean>>({});
  
  // Portrait type state
  const [portraitType, setPortraitType] = useState<"basic" | "styled">("basic");
  const [backgroundType, setBackgroundType] = useState<"solid" | "translucent">("solid");
  const [selectedThemes, setSelectedThemes] = useState<string[]>(["", "", ""]);
  const [selectedLayouts, setSelectedLayouts] = useState<string[]>(["", "", ""]);
  
  // Legacy state (for single-pet mode compatibility)
  const [petType, setPetType] = useState<"dog" | "cat" | "other" | "">("");
  const [breedSearch, setBreedSearch] = useState("");
  const [showBreedList, setShowBreedList] = useState(false);
  const [petName, setPetName] = useState("");
  const [breed, setBreed] = useState("");
  const [customBreed, setCustomBreed] = useState("");
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [extraNotes, setExtraNotes] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [customBreeds, setCustomBreeds] = useState<string[]>([]); // Learned breeds from users
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [fingerprint, setFingerprint] = useState<string>("");
  const [existingSession, setExistingSession] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const breedListRef = useRef<HTMLDivElement>(null);
  
  // Generation state
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [testModeStatus, setTestModeStatus] = useState<boolean | null>(null);
  const router = useRouter();

  // Load custom breeds from API when pet type changes
  useEffect(() => {
    if (petType) {
      fetch(`/api/breeds/list?petType=${petType}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.breeds && Array.isArray(data.breeds)) {
            setCustomBreeds(data.breeds);
          }
        })
        .catch((err) => {
          console.log("Could not load custom breeds (non-blocking):", err);
        });
    } else {
      setCustomBreeds([]);
    }
  }, [petType]);

  // Get base breeds based on pet type
  const baseBreeds = 
    petType === "dog" ? DOG_BREEDS : 
    petType === "cat" ? CAT_BREEDS : 
    petType === "other" ? OTHER_ANIMALS : [];

  // Merge base breeds with learned custom breeds (avoid duplicates)
  const availableBreeds = [
    ...baseBreeds.filter((b) => b !== "Other"), // Remove "Other" from base list
    ...customBreeds.filter((cb) => !baseBreeds.some((bb) => bb.toLowerCase() === cb.toLowerCase())), // Add custom breeds not in base list
    "Other", // Always include "Other" at the end
  ];

  // Filter breeds based on search
  const filteredBreeds = availableBreeds.filter((b) =>
    b.toLowerCase().includes(breedSearch.toLowerCase())
  );

  // Handle breed selection
  const handleBreedSelect = (selectedBreed: string) => {
    if (selectedBreed === "Other") {
      setBreed("Other");
      setCustomBreed("");
    } else {
      setBreed(selectedBreed);
      setCustomBreed("");
    }
    setBreedSearch("");
    setShowBreedList(false);
  };

  // Reset breed when pet type changes
  const handlePetTypeChange = (type: "dog" | "cat" | "other" | "") => {
    setPetType(type);
    setBreed("");
    setBreedSearch("");
    setCustomBreed("");
    setShowBreedList(false);
  };

  // Close breed list when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (breedListRef.current && !breedListRef.current.contains(event.target as Node)) {
        setShowBreedList(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Compress image for mobile uploads (reduce file size)
  const compressImage = (file: File, maxWidth: number = 2000, quality: number = 0.85): Promise<File> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = document.createElement("img");
        img.onload = () => {
          const canvas = document.createElement("canvas");
          let width = img.width;
          let height = img.height;

          // Calculate new dimensions
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext("2d");
          if (!ctx) {
            reject(new Error("Could not get canvas context"));
            return;
          }

          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error("Failed to compress image"));
                return;
              }
              const compressedFile = new File([blob], file.name, {
                type: "image/jpeg",
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            },
            "image/jpeg",
            quality
          );
        };
        img.onerror = reject;
        img.src = e.target?.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleFileSelect = async (file: File) => {
    if (!file) return;

    // Check if it's an image file (including HEIC/HEIF for iPhone)
    const validTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
      "image/heic",
      "image/heif",
      "image/hevc", // Alternative HEIC extension
    ];

    const fileExtension = file.name.toLowerCase().split(".").pop();
    const isImageType = file.type.startsWith("image/") || 
                       validTypes.includes(file.type.toLowerCase()) ||
                       ["jpg", "jpeg", "png", "gif", "webp", "heic", "heif", "hevc"].includes(fileExtension || "");

    if (!isImageType) {
      setError("Please select a valid image file (JPG, PNG, GIF, HEIC, or WebP)");
      return;
    }

    // Check file size (max 20MB for mobile, will compress)
    const maxSize = 20 * 1024 * 1024; // 20MB
    if (file.size > maxSize) {
      setError("File is too large. Please select an image under 20MB.");
      return;
    }

    try {
      // Compress image if it's large (especially for mobile)
      let processedFile = file;
      if (file.size > 2 * 1024 * 1024) { // Compress if over 2MB
        setIsGenerating(true);
        processedFile = await compressImage(file, 2000, 0.85);
        setIsGenerating(false);
      }

      setPhoto(processedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(processedFile);
      setError(null);
    } catch (err: any) {
      console.error("Error processing image:", err);
      setError("Failed to process image. Please try another file.");
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const [requiresPayment, setRequiresPayment] = useState(false);
  const [selectedStyleForPayment, setSelectedStyleForPayment] = useState<string>("");

  // Check test mode status on component mount
  useEffect(() => {
    fetch("/api/test-mode-status")
      .then((res) => res.json())
      .then((data) => {
        setTestModeStatus(data.testMode);
      })
      .catch(() => {
        // Silently fail - test mode check is optional
      });
  }, []);

  // Payment initiation function
  const initiatePayment = async (style: string) => {
    if (!sessionId || !style) {
      setError("Session information missing. Please refresh and try again.");
      return;
    }

    try {
      const response = await fetch("/api/checkout-additional", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          style: style,
          session_id: sessionId,
          fingerprint: fingerprint,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.checkout_url) {
          // Redirect to Stripe checkout
          window.location.href = data.checkout_url;
        }
      } else {
        setError("Failed to initiate payment. Please try again.");
      }
    } catch (error) {
      console.error("Error initiating payment:", error);
      setError("Payment system error. Please try again.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsGenerating(true);
    setError(null);

    try {
      // Multi-subject wizard flow
      if (subjects.length > 0) {
        // Upload all subject photos first
        const uploadedSubjects = await Promise.all(
          subjects.map(async (subject) => {
            if (!subject.photo) {
              throw new Error(`Please upload a photo for ${subject.type === "pet" ? "pet" : "person"} ${subjects.indexOf(subject) + 1}`);
            }
            
            const uploadFormData = new FormData();
            uploadFormData.append("file", subject.photo);
            
            const uploadResponse = await fetch("/api/upload", {
              method: "POST",
              body: uploadFormData,
            });
            
            if (!uploadResponse.ok) {
              const errorData = await uploadResponse.json().catch(() => ({ error: "Unknown error" }));
              const errorMessage = errorData.message || errorData.error || `Failed to upload photo for ${subject.type === "pet" ? "pet" : "person"} ${subjects.indexOf(subject) + 1}`;
              console.error("Upload error:", errorData);
              throw new Error(errorMessage);
            }
            
            const uploadData = await uploadResponse.json();
            
            return {
              ...subject,
              imageUrl: uploadData.url,
            };
          })
        );
        
        // Prepare themes and layouts based on portrait type
        const themes = portraitType === "styled" ? selectedThemes.filter(t => t) : [];
        const layouts = selectedLayouts.filter(l => l);
        
        // Call generate API with multi-subject data
        const generateResponse = await fetch("/api/generate-multi-subject", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            subjects: uploadedSubjects.map(s => ({
              type: s.type,
              name: s.name,
              breed: s.breed,
              petType: s.petType,
              sex: s.sex,
              ethnicity: s.ethnicity,
              hairColor: s.hairColor,
              imageUrl: s.imageUrl,
            })),
            portraitType,
            themes: themes.length > 0 ? themes : undefined,
            layouts,
            backgroundType,
            fingerprint,
            session_id: sessionId,
          }),
        });
        
        if (!generateResponse.ok) {
          const errorData = await generateResponse.json();
          throw new Error(errorData.message || "Failed to generate portraits");
        }
        
        const generateData = await generateResponse.json();
        
        if (!generateData.variants || Object.keys(generateData.variants).length === 0) {
          throw new Error("No variants generated. Please try again.");
        }
        
        // Store variants and navigate
        sessionStorage.setItem("portraitVariants", JSON.stringify(generateData.variants));
        sessionStorage.setItem("subjects", JSON.stringify(uploadedSubjects));
        sessionStorage.setItem("sessionId", generateData.session_id || sessionId || "");
        sessionStorage.setItem("testMode", generateData.testMode ? "true" : "false");
        
        router.push("/variants");
      } else {
        // Legacy single-pet flow (fallback)
        if (!photo) {
          throw new Error("Please upload a photo");
        }
        
        const uploadFormData = new FormData();
        uploadFormData.append("file", photo);
        
        const uploadResponse = await fetch("/api/upload", {
          method: "POST",
          body: uploadFormData,
        });
        
        if (!uploadResponse.ok) {
          throw new Error("Failed to upload photo");
        }
        
        const uploadData = await uploadResponse.json();
        const imageUrl = uploadData.url;
        
        const finalBreed = breed === "Other" ? customBreed : breed;
        
        if (selectedStyles.length !== 3) {
          throw new Error("Please select exactly 3 styles for your free generation");
        }
        
        // Generate images for all available products to ensure correct aspect ratios
        // Canvas: canvas-12x12 (1:1) and canvas-16x20 (4:5)
        // Blankets: blanket-37x57 (3:4), blanket-50x60 (5:6)
        // This ensures images are generated with correct aspect ratios for each product
        const productIds = [
          "canvas-12x12", 
          "canvas-16x20",
          "blanket-37x57",
          "blanket-50x60",
        ];
        
        const generateResponse = await fetch("/api/generate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            petName,
            breed: finalBreed,
            petType,
            styles: selectedStyles,
            extraNotes,
            imageUrl,
            fingerprint,
            session_id: sessionId,
            backgroundType,
            productIds, // Pass product IDs for product-specific aspect ratios
          }),
        });
        
        if (!generateResponse.ok) {
          const errorData = await generateResponse.json();
          throw new Error(errorData.message || "Failed to generate portraits");
        }
        
        const generateData = await generateResponse.json();
        
        if (!generateData.variants || Object.keys(generateData.variants).length === 0) {
          throw new Error("No variants generated. Please try again.");
        }
        
        sessionStorage.setItem("portraitVariants", JSON.stringify(generateData.variants));
        // Store product variants map if available (for product-specific aspect ratios)
        if (generateData.productVariantsMap) {
          sessionStorage.setItem("productVariantsMap", JSON.stringify(generateData.productVariantsMap));
        }
        sessionStorage.setItem("petName", petName);
        sessionStorage.setItem("selectedStyles", JSON.stringify(selectedStyles));
        sessionStorage.setItem("sessionId", generateData.session_id || sessionId || "");
        sessionStorage.setItem("testMode", generateData.testMode ? "true" : "false");
        
        router.push("/variants");
      }
    } catch (err: any) {
      console.error("Error:", err);
      const errorMessage = err.message || "Something went wrong. Please try again.";
      setError(errorMessage);
      setIsGenerating(false);
    }
  };

  // Wizard helper functions
  const handleSubjectPhotoSelect = async (file: File, subjectIndex: number) => {
    if (!file) return;
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp", "image/heic", "image/heif"];
    if (!validTypes.some(t => file.type.startsWith(t.split("/")[0]))) {
      setError("Please select a valid image file");
      return;
    }
    try {
      let processedFile = file;
      if (file.size > 2 * 1024 * 1024) {
        processedFile = await compressImage(file, 2000, 0.85);
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const updated = [...subjects];
        updated[subjectIndex] = {
          ...updated[subjectIndex],
          photo: processedFile,
          photoPreview: reader.result as string,
        };
        setSubjects(updated);
        // Clear photo validation error
        if (validationErrors[subjectIndex]?.photo) {
          const newErrors = { ...validationErrors };
          if (newErrors[subjectIndex]) {
            delete newErrors[subjectIndex].photo;
            if (Object.keys(newErrors[subjectIndex]).length === 0) {
              delete newErrors[subjectIndex];
            }
          }
          setValidationErrors(newErrors);
        }
      };
      reader.readAsDataURL(processedFile);
    } catch (err: any) {
      setError("Failed to process image");
    }
  };

  const validateAndContinue = () => {
    setError(null);
    const newErrors: Record<number, Record<string, boolean>> = {};
    let hasErrors = false;
    
    subjects.forEach((subject, index) => {
      const subjectErrors: Record<string, boolean> = {};
      if (subject.type === "pet") {
        if (!subject.name) subjectErrors.name = true;
        if (!subject.petType) subjectErrors.petType = true;
        if (!subject.breed) subjectErrors.breed = true;
        if (!subject.sex) subjectErrors.sex = true;
      } else {
        if (!subject.sex) subjectErrors.sex = true;
      }
      if (!subject.photo && !subject.photoPreview) subjectErrors.photo = true;
      
      if (Object.keys(subjectErrors).length > 0) {
        newErrors[index] = subjectErrors;
        hasErrors = true;
      }
    });
    
    if (hasErrors) {
      setValidationErrors(newErrors);
      setError("Please complete all required fields and upload photos for all subjects");
      return false;
    }
    setValidationErrors({});
    return true;
  };

  const handleNumbersContinue = () => {
    const newSubjects: Subject[] = [];
    for (let i = 0; i < selectedOwnerCount; i++) {
      newSubjects.push({
        id: i + 1,
        type: "person",
        photo: null,
        photoPreview: null,
      });
    }
    for (let i = 0; i < selectedPetCount; i++) {
      newSubjects.push({
        id: selectedOwnerCount + i + 1,
        type: "pet",
        photo: null,
        photoPreview: null,
      });
    }
    setSubjects(newSubjects);
    setWizardStep("subjects-info");
  };

  // Handle button click for generating portraits
  const handleGenerateClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    // Create a synthetic form event
    const syntheticEvent = {
      preventDefault: () => {},
    } as React.FormEvent;
    await handleSubmit(syntheticEvent);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Wizard - Page-by-Page Process */}
        <div className="min-h-[600px] flex flex-col items-center justify-center py-12">
          {/* Step 1: Numbers - ALWAYS FIRST */}
          {wizardStep === "numbers" && (
            <div className="w-full max-w-md mx-auto px-4">
              <h2 className="text-3xl font-bold text-gray-900 mb-2 text-center">How many subjects?</h2>
              <p className="text-sm text-gray-600 mb-8 text-center">Select the number of pets and owners for your portrait</p>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Number of Owners</label>
                  <select
                    value={selectedOwnerCount}
                    onChange={(e) => {
                      const count = parseInt(e.target.value);
                      setSelectedOwnerCount(count);
                      const maxPets = 5 - count;
                      if (selectedPetCount > maxPets) {
                        setSelectedPetCount(maxPets);
                      }
                    }}
                    className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                  >
                    <option value={0}>0 Owners</option>
                    <option value={1}>1 Owner</option>
                    <option value={2}>2 Owners</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Number of Pets (1-{5 - selectedOwnerCount})</label>
                  <select
                    value={selectedPetCount}
                    onChange={(e) => setSelectedPetCount(parseInt(e.target.value))}
                    className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                  >
                    {Array.from({ length: 5 - selectedOwnerCount }, (_, i) => i + 1).map((count) => (
                      <option key={count} value={count}>
                        {count} Pet{count !== 1 ? "s" : ""}
                      </option>
                    ))}
                  </select>
                </div>
                
                <button
                  type="button"
                  onClick={handleNumbersContinue}
                  disabled={selectedPetCount < 1}
                  className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white text-base font-semibold rounded-lg transition-colors"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Subjects Info - All at Once */}
          {wizardStep === "subjects-info" && (
            <div className="w-full max-w-4xl mx-auto px-4">
              <h2 className="text-3xl font-bold text-gray-900 mb-2 text-center">Tell us about all subjects</h2>
              <p className="text-sm text-gray-600 mb-6 text-center">Fill in the information for each subject</p>
              
              {/* Photo Requirements at Top */}
              <div className="mb-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
                <p className="text-sm font-semibold text-blue-900 mb-2">📸 Photo Requirements for All Subjects:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs font-medium text-blue-800 mb-1">For Pets:</p>
                    <ul className="text-xs text-blue-800 space-y-1 list-disc list-inside">
                      <li>Clear, well-lit photo</li>
                      <li>Face and eyes clearly visible</li>
                      <li>Good lighting, avoid shadows</li>
                      <li>Supports: JPG, PNG, GIF, HEIC, WebP (Max 20MB)</li>
                    </ul>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-blue-800 mb-1">For People:</p>
                    <ul className="text-xs text-blue-800 space-y-1 list-disc list-inside">
                      <li><strong>Face-focused photo</strong> - portrait should show your face clearly</li>
                      <li>Face clearly visible, centered in frame</li>
                      <li>Good lighting, avoid shadows on face</li>
                      <li>Supports: JPG, PNG, GIF, HEIC, WebP (Max 20MB)</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="space-y-6 max-h-[70vh] overflow-y-auto bg-white rounded-lg shadow-xl p-6">
                {subjects.map((subject, index) => {
                  const baseBreedsForSubject = subject.petType === "dog" ? DOG_BREEDS : subject.petType === "cat" ? CAT_BREEDS : OTHER_ANIMALS;
                  const availableBreedsForSubject = [
                    ...baseBreedsForSubject.filter((b) => b !== "Other"),
                    ...customBreeds.filter((cb) => !baseBreedsForSubject.some((bb) => bb.toLowerCase() === cb.toLowerCase())),
                    "Other",
                  ];
                  const filteredBreedsForSubject = availableBreedsForSubject.filter((b) =>
                    b.toLowerCase().includes((breedSearches[index] || "").toLowerCase())
                  );
                  
                  return (
                    <div key={subject.id} className="border-2 border-gray-200 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        {subject.type === "pet" ? `🐾 Pet ${index + 1}` : `👤 Person ${index + 1}`}
                      </h3>
                      
                      {subject.type === "pet" ? (
                        <>
                          <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Pet Name
                              {validationErrors[index]?.name && <span className="text-red-500 ml-1">(Required)</span>}
                            </label>
                            <input
                              type="text"
                              value={subject.name || ""}
                              onChange={(e) => {
                                const updated = [...subjects];
                                updated[index] = { ...updated[index], name: e.target.value };
                                setSubjects(updated);
                                if (validationErrors[index]?.name) {
                                  const newErrors = { ...validationErrors };
                                  if (newErrors[index]) {
                                    delete newErrors[index].name;
                                    if (Object.keys(newErrors[index]).length === 0) delete newErrors[index];
                                  }
                                  setValidationErrors(newErrors);
                                }
                              }}
                              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                                validationErrors[index]?.name ? "border-red-500" : "border-gray-300"
                              }`}
                            />
                          </div>
                          
                          <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Species
                              {validationErrors[index]?.petType && <span className="text-red-500 ml-1">(Required)</span>}
                            </label>
                            <select
                              value={subject.petType || ""}
                              onChange={(e) => {
                                const updated = [...subjects];
                                updated[index] = { ...updated[index], petType: e.target.value as "dog" | "cat" | "other", breed: "" };
                                setSubjects(updated);
                                if (validationErrors[index]?.petType) {
                                  const newErrors = { ...validationErrors };
                                  if (newErrors[index]) {
                                    delete newErrors[index].petType;
                                    if (Object.keys(newErrors[index]).length === 0) delete newErrors[index];
                                  }
                                  setValidationErrors(newErrors);
                                }
                              }}
                              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                                validationErrors[index]?.petType ? "border-red-500" : "border-gray-300"
                              }`}
                            >
                              <option value="">Select...</option>
                              <option value="dog">Dog</option>
                              <option value="cat">Cat</option>
                              <option value="other">Other</option>
                            </select>
                          </div>
                          
                          {subject.petType && (
                            <div className="mb-4 relative">
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Breed
                                {validationErrors[index]?.breed && <span className="text-red-500 ml-1">(Required - select from list)</span>}
                              </label>
                              <input
                                type="text"
                                value={breedSearches[index] || subject.breed || ""}
                                onChange={(e) => {
                                  setBreedSearches({ ...breedSearches, [index]: e.target.value });
                                  setShowBreedLists({ ...showBreedLists, [index]: true });
                                  const updated = [...subjects];
                                  updated[index] = { ...updated[index], breed: "" };
                                  setSubjects(updated);
                                }}
                                onFocus={() => setShowBreedLists({ ...showBreedLists, [index]: true })}
                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                                  validationErrors[index]?.breed ? "border-red-500" : "border-gray-300"
                                }`}
                                placeholder="Search breeds..."
                              />
                              {showBreedLists[index] && filteredBreedsForSubject.length > 0 && (
                                <div className="absolute z-50 w-full mt-1 bg-white border-2 border-gray-300 rounded-lg shadow-xl max-h-64 overflow-y-auto">
                                  {filteredBreedsForSubject.map((b) => (
                                    <button
                                      key={b}
                                      type="button"
                                      onClick={() => {
                                        const updated = [...subjects];
                                        updated[index] = { ...updated[index], breed: b === "Other" ? "Other" : b };
                                        setSubjects(updated);
                                        setBreedSearches({ ...breedSearches, [index]: "" });
                                        setShowBreedLists({ ...showBreedLists, [index]: false });
                                        if (validationErrors[index]?.breed) {
                                          const newErrors = { ...validationErrors };
                                          if (newErrors[index]) {
                                            delete newErrors[index].breed;
                                            if (Object.keys(newErrors[index]).length === 0) delete newErrors[index];
                                          }
                                          setValidationErrors(newErrors);
                                        }
                                      }}
                                      className="w-full text-left px-4 py-3 hover:bg-blue-50 transition-colors"
                                    >
                                      {b}
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}
                          
                          <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Sex
                              {validationErrors[index]?.sex && <span className="text-red-500 ml-1">(Required)</span>}
                            </label>
                            <select
                              value={subject.sex || ""}
                              onChange={(e) => {
                                const updated = [...subjects];
                                updated[index] = { ...updated[index], sex: e.target.value };
                                setSubjects(updated);
                                if (validationErrors[index]?.sex) {
                                  const newErrors = { ...validationErrors };
                                  if (newErrors[index]) {
                                    delete newErrors[index].sex;
                                    if (Object.keys(newErrors[index]).length === 0) delete newErrors[index];
                                  }
                                  setValidationErrors(newErrors);
                                }
                              }}
                              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                                validationErrors[index]?.sex ? "border-red-500" : "border-gray-300"
                              }`}
                            >
                              <option value="">Select...</option>
                              <option value="male">Male</option>
                              <option value="female">Female</option>
                            </select>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Sex/Gender
                              {validationErrors[index]?.sex && <span className="text-red-500 ml-1">(Required)</span>}
                            </label>
                            <select
                              value={subject.sex || ""}
                              onChange={(e) => {
                                const updated = [...subjects];
                                updated[index] = {
                                  ...updated[index],
                                  sex: e.target.value,
                                };
                                setSubjects(updated);
                                if (validationErrors[index]?.sex) {
                                  const newErrors = { ...validationErrors };
                                  if (newErrors[index]) {
                                    delete newErrors[index].sex;
                                    if (Object.keys(newErrors[index]).length === 0) delete newErrors[index];
                                  }
                                  setValidationErrors(newErrors);
                                }
                              }}
                              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                                validationErrors[index]?.sex ? "border-red-500" : "border-gray-300"
                              }`}
                            >
                              <option value="">Select...</option>
                              <option value="male">Male</option>
                              <option value="female">Female</option>
                              <option value="non-binary">Non-Binary</option>
                              <option value="prefer-not-to-say">Prefer not to say</option>
                            </select>
                          </div>
                          
                          {subject.sex && (
                            <>
                              <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Ethnicity</label>
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-xs text-gray-600">Optional - can skip</span>
                                  <label className="flex items-center text-xs text-gray-600">
                                    <input
                                      type="checkbox"
                                      checked={subject.skipDemographics || false}
                                      onChange={(e) => {
                                        const updated = [...subjects];
                                        updated[index] = { ...updated[index], skipDemographics: e.target.checked };
                                        setSubjects(updated);
                                      }}
                                      className="mr-1"
                                    />
                                    Skip this question
                                  </label>
                                </div>
                                <select
                                  value={subject.ethnicity || ""}
                                  onChange={(e) => {
                                    const updated = [...subjects];
                                    updated[index] = { ...updated[index], ethnicity: e.target.value };
                                    setSubjects(updated);
                                  }}
                                  disabled={subject.skipDemographics}
                                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none disabled:bg-gray-100"
                                >
                                  <option value="">Prefer not to specify</option>
                                  <option value="asian">Asian</option>
                                  <option value="black">Black or African American</option>
                                  <option value="hispanic">Hispanic or Latino</option>
                                  <option value="middle-eastern">Middle Eastern or North African</option>
                                  <option value="native-american">Native American or Alaska Native</option>
                                  <option value="pacific-islander">Native Hawaiian or Other Pacific Islander</option>
                                  <option value="white">White or Caucasian</option>
                                  <option value="multiracial">Multiracial or Mixed</option>
                                  <option value="other">Other</option>
                                </select>
                              </div>
                              
                              <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Hair Color</label>
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-xs text-gray-600">Optional</span>
                                  <label className="flex items-center text-xs text-gray-600">
                                    <input
                                      type="checkbox"
                                      checked={subject.hairColor === "skip"}
                                      onChange={(e) => {
                                        const updated = [...subjects];
                                        updated[index] = { ...updated[index], hairColor: e.target.checked ? "skip" : "" };
                                        setSubjects(updated);
                                      }}
                                      className="mr-1"
                                    />
                                    Skip this question
                                  </label>
                                </div>
                                <select
                                  value={subject.hairColor || ""}
                                  onChange={(e) => {
                                    const updated = [...subjects];
                                    updated[index] = { ...updated[index], hairColor: e.target.value };
                                    setSubjects(updated);
                                  }}
                                  disabled={subject.hairColor === "skip"}
                                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none disabled:bg-gray-100"
                                >
                                  <option value="">Prefer not to specify</option>
                                  <option value="black">Black</option>
                                  <option value="brown">Brown</option>
                                  <option value="blonde">Blonde</option>
                                  <option value="red">Red</option>
                                  <option value="gray">Gray</option>
                                  <option value="white">White</option>
                                  <option value="n/a">N/A</option>
                                  <option value="other">Other</option>
                                </select>
                              </div>
                            </>
                          )}
                        </>
                      )}
                      
                      {/* Photo Upload */}
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Photo {subject.type === "pet" ? "of Pet" : "of Person"}
                          {validationErrors[index]?.photo && <span className="text-red-500 ml-1">(Required)</span>}
                        </label>
                        <div
                          onClick={() => {
                            const input = document.createElement("input");
                            input.type = "file";
                            input.accept = "image/*";
                            input.onchange = (e) => {
                              const file = (e.target as HTMLInputElement).files?.[0];
                              if (file) handleSubjectPhotoSelect(file, index);
                            };
                            input.click();
                          }}
                          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 transition bg-white ${
                            validationErrors[index]?.photo ? "border-red-500" : "border-gray-300"
                          }`}
                        >
                          {subject.photoPreview ? (
                            <div className="space-y-4">
                              <div className="relative max-w-xs mx-auto aspect-square rounded-lg shadow-md overflow-hidden">
                                <Image src={subject.photoPreview} alt="Preview" fill className="object-cover" />
                              </div>
                              <p className="text-sm text-gray-600">📱 Tap to change photo</p>
                            </div>
                          ) : (
                            <div className="space-y-2">
                              <svg className="mx-auto h-16 w-16 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8m0-8h8m-4 0H28m-12 4h.01M36 20h.01" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                              <p className="text-sm font-semibold text-blue-600">📱 Tap to upload</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setError(null);
                    setWizardStep("numbers");
                  }}
                  className="flex-1 px-4 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition-colors"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (validateAndContinue()) {
                      setWizardStep("portrait-type");
                    }
                  }}
                  className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Portrait Type */}
          {wizardStep === "portrait-type" && (
            <div className="w-full max-w-4xl mx-auto px-4">
              <h2 className="text-3xl font-bold text-gray-900 mb-2 text-center">Choose Portrait Type & Layout</h2>
              <p className="text-sm text-gray-600 mb-8 text-center">Select your portrait style and layout options</p>
              
              <div className="space-y-6 bg-white rounded-lg shadow-xl p-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Portrait Type</label>
                  <select
                    value={portraitType}
                    onChange={(e) => {
                      setPortraitType(e.target.value as "basic" | "styled");
                      if (e.target.value === "basic") {
                        setSelectedThemes(["", "", ""]);
                      }
                    }}
                    className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                  >
                    <option value="basic">Basic Portrait - A timeless, professional portrait perfect for displaying in your home</option>
                    <option value="styled">Styled Portraits - Transform your pet into themed masterpieces</option>
                  </select>
                </div>
                
                {portraitType === "styled" ? (
                  <div className="space-y-4">
                    <p className="text-sm font-medium text-gray-700">Select 3 Theme + Layout Combinations:</p>
                    {[0, 1, 2].map((num) => (
                      <div key={num} className="grid grid-cols-2 gap-4 p-4 border border-gray-200 rounded-lg">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Theme {num + 1} {num === 0 && "(Required)"}</label>
                          <select
                            value={selectedThemes[num]}
                            onChange={(e) => {
                              const updated = [...selectedThemes];
                              updated[num] = e.target.value;
                              setSelectedThemes(updated);
                            }}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                          >
                            <option value="">{num === 0 ? "Select theme..." : "Optional - Select theme..."}</option>
                            {STYLES.map((style) => (
                              <option key={style} value={style}>{style}</option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Layout {num + 1} {num === 0 && "(Required)"}</label>
                          <select
                            value={selectedLayouts[num]}
                            onChange={(e) => {
                              const updated = [...selectedLayouts];
                              updated[num] = e.target.value;
                              setSelectedLayouts(updated);
                            }}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                          >
                            <option value="">{num === 0 ? "Select layout..." : "Optional - Select layout..."}</option>
                            <option value="side-by-side">Side by Side</option>
                            <option value="pet-in-front">Pet in Front</option>
                            <option value="owner-holding">Owner Holding</option>
                            <option value="seated-together">Seated Together</option>
                            <option value="pet-beside-owner">Pet Beside Owner</option>
                          </select>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-sm font-medium text-gray-700">Select Layout Options:</p>
                    {[0, 1, 2].map((num) => (
                      <div key={num}>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Layout {num + 1} {num === 0 && "(Required)"}</label>
                        <select
                          value={selectedLayouts[num]}
                          onChange={(e) => {
                            const updated = [...selectedLayouts];
                            updated[num] = e.target.value;
                            setSelectedLayouts(updated);
                          }}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        >
                          <option value="">{num === 0 ? "Select layout..." : "Optional - Select layout..."}</option>
                          <option value="side-by-side">Side by Side</option>
                          <option value="pet-in-front">Pet in Front</option>
                          <option value="owner-holding">Owner Holding</option>
                          <option value="seated-together">Seated Together</option>
                          <option value="pet-beside-owner">Pet Beside Owner</option>
                        </select>
                      </div>
                    ))}
                  </div>
                )}
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Background Type</label>
                  <select
                    value={backgroundType}
                    onChange={(e) => setBackgroundType(e.target.value as "solid" | "translucent")}
                    className="w-full px-4 py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
                  >
                    <option value="solid">Solid Background</option>
                    <option value="translucent">Translucent/Transparent Background</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-2">
                    {backgroundType === "translucent"
                      ? "Perfect for printing on clothes, products, or overlaying on other images"
                      : "Standard solid background for traditional portraits"}
                  </p>
                </div>
                
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setError(null);
                      setWizardStep("subjects-info");
                    }}
                    className="flex-1 px-4 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-medium transition-colors"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={async (e) => {
                      e.preventDefault();
                      if (portraitType === "styled" && !selectedThemes[0]) {
                        setError("Please select at least one theme");
                        return;
                      }
                      if (!selectedLayouts[0]) {
                        setError("Please select at least one layout");
                        return;
                      }
                      // Generate directly - no review step
                      await handleSubmit({ preventDefault: () => {} } as React.FormEvent);
                    }}
                    disabled={isGenerating}
                    className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
                  >
                    {isGenerating ? "Generating..." : "Generate Portraits"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mt-4">
            <p className="font-medium">Error:</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Test Mode Status Indicator */}
        {testModeStatus === true && (
          <div className="bg-blue-50 border-l-4 border-blue-400 text-blue-700 px-4 py-3 rounded-lg mt-4">
            <div className="flex items-center">
              <span className="text-xl mr-2">🧪</span>
              <div>
                <p className="font-medium text-sm">
                  <strong>Test Mode Active:</strong> Using free placeholder images (no API costs)
                </p>
                <p className="text-xs mt-1">
                  To switch to production, set FAL_TEST_MODE=false in .env.local and restart server
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 text-center">
          <Link href="/" className="text-amber-600 hover:text-amber-700 font-medium">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

