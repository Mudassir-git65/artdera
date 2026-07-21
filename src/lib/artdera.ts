export const IMAGES = {
  art1: "/images/artworks/art-1-720.webp",
  art2: "/images/artworks/art-2-720.webp",
  art3: "/images/artworks/art-3-720.webp",
  art4: "/images/artworks/art-4-720.webp",
  art5: "/images/artworks/art-5-720.webp",
  art6: "/images/artworks/art-6-720.webp",
  creator1: "/images/creators/creator-1-720.webp",
  creator2: "/images/creators/creator-2-720.webp",
  creator3: "/images/creators/creator-3-720.webp",
  heroInterior: "/images/hero/artdera-hero-1200.webp",
  heroStudio: "/images/interiors/artist-studio-1200.webp",
  roomDining: "/images/interiors/dining-room-1200.webp",
  shopInterior: "/images/interiors/shop-this-space-1200.webp",
  categoryPrints: "/images/categories/prints-768.webp",
  categoryWallDecor: "/images/categories/wall-decor-768.webp",
  customCommission: "/images/interiors/custom-commission-1200.webp",
  businessHospitality: "/images/interiors/business-hospitality-1200.webp",
  aiCreatedWork: "/images/editorial/ai-created-work-1200.webp",
};

export const IMAGE_FALLBACKS = {
  artwork: "/images/fallbacks/artwork-placeholder.webp",
  artist: "/images/fallbacks/artist-placeholder.webp",
  gallery: "/images/fallbacks/gallery-placeholder.webp",
  journal: "/images/fallbacks/journal-placeholder.webp",
  interior: "/images/fallbacks/interior-placeholder.webp",
};

export type Category = {
  slug: string;
  name: string;
  blurb: string;
  image: string;
  imageAlt?: string;
};
export type Creator = {
  slug: string;
  name: string;
  handle: string;
  location: string;
  discipline: string;
  bio: string;
  verified: boolean;
  portrait: string;
  works: string[];
};
export type Product = {
  slug: string;
  title: string;
  creatorSlug: string;
  categorySlug: string;
  price: number;
  currency: "PKR";
  kind: "Original" | "Limited Edition" | "Open Edition" | "Handmade" | "AI-assisted";
  editionOf?: number;
  medium: string;
  dimensions: string;
  year: number;
  framed: boolean;
  colours: string[];
  room: string[];
  description: string;
  images: string[];
  featured?: boolean;
  new?: boolean;
};
export type EditorialCollection = {
  slug: string;
  name: string;
  blurb: string;
  products: string[];
  cover: string;
};

export const HOMEPAGE_CATEGORIES: Category[] = [
  {
    slug: "original-works",
    name: "Original Works",
    blurb: "One-of-one paintings and mixed-media works made by independent artists.",
    image: IMAGES.art6,
    imageAlt: "Textured original abstract painting in warm ivory, oxblood and gold",
  },
  {
    slug: "prints",
    name: "Prints",
    blurb: "Fine-art editions selected for beautifully considered walls.",
    image: IMAGES.categoryPrints,
    imageAlt: "Pair of framed botanical fine-art prints in a warm contemporary interior",
  },
  {
    slug: "calligraphy",
    name: "Calligraphy",
    blurb: "Expressive Urdu, Arabic and contemporary script-led work.",
    image: IMAGES.art2,
    imageAlt: "Minimal black calligraphy on a warm ivory ground",
  },
  {
    slug: "photography",
    name: "Photography",
    blurb: "Landscape, architectural and documentary fine-art photographs.",
    image: IMAGES.art3,
    imageAlt: "Fine-art photograph of a mountain range at dusk",
  },
  {
    slug: "wall-decor",
    name: "Wall Décor",
    blurb: "Coordinated wall pieces and sculptural accents for complete rooms.",
    image: IMAGES.categoryWallDecor,
    imageAlt: "Coordinated gallery wall with abstract artwork and sculptural decor",
  },
  {
    slug: "custom-commissions",
    name: "Custom Commissions",
    blurb: "Collaborate with a creator on a piece made for your space.",
    image: IMAGES.customCommission,
    imageAlt: "Independent artist developing a commissioned painting in her studio",
  },
];

export const CATEGORIES: Category[] = [...HOMEPAGE_CATEGORIES];
export const CREATORS: Creator[] = [
  {
    slug: "ayla-raza",
    name: "Ayla Raza",
    handle: "@ayla-raza",
    location: "Lahore, Pakistan",
    discipline: "Painter and mixed-media artist",
    bio: "Ayla builds spare, tactile compositions from remembered rooms, botanical forms and the shifting light of Lahore.",
    verified: true,
    portrait: IMAGES.creator1,
    works: ["quiet-horizon", "balanced-forms", "pomegranate-study"],
  },
  {
    slug: "faraz-khan",
    name: "Faraz Khan",
    handle: "@faraz-khan",
    location: "Islamabad, Pakistan",
    discipline: "Calligrapher",
    bio: "Faraz explores the rhythm of traditional script through restrained contemporary compositions.",
    verified: true,
    portrait: IMAGES.creator2,
    works: ["silence-in-script", "gilded-earth"],
  },
  {
    slug: "sameer-ali",
    name: "Sameer Ali",
    handle: "@sameer-ali",
    location: "Gilgit, Pakistan",
    discipline: "Fine-art photographer",
    bio: "Sameer's photographs attend to scale, silence and changing mountain light.",
    verified: false,
    portrait: IMAGES.creator3,
    works: ["northern-stillness"],
  },
];
export const PRODUCTS: Product[] = [
  {
    slug: "quiet-horizon",
    title: "Quiet Horizon",
    creatorSlug: "ayla-raza",
    categorySlug: "original-works",
    price: 75000,
    currency: "PKR",
    kind: "Original",
    medium: "Acrylic on canvas",
    dimensions: "90 × 110 cm",
    year: 2026,
    framed: false,
    colours: ["terracotta", "ivory"],
    room: ["Living room", "Office", "Hotel"],
    description: "A single vermilion gesture held against a field of warm, quiet ground.",
    images: [IMAGES.art1],
    featured: true,
    new: true,
  },
  {
    slug: "silence-in-script",
    title: "Silence in Script",
    creatorSlug: "faraz-khan",
    categorySlug: "calligraphy",
    price: 42000,
    currency: "PKR",
    kind: "Original",
    medium: "Ink on handmade paper",
    dimensions: "60 × 75 cm",
    year: 2025,
    framed: true,
    colours: ["ink", "ivory"],
    room: ["Living room", "Dining room", "Office"],
    description:
      "A restrained calligraphic study that lets gesture and negative space carry equal weight.",
    images: [IMAGES.art2],
    featured: true,
  },
  {
    slug: "northern-stillness",
    title: "Northern Stillness",
    creatorSlug: "sameer-ali",
    categorySlug: "photography",
    price: 36000,
    currency: "PKR",
    kind: "Limited Edition",
    editionOf: 25,
    medium: "Archival pigment print",
    dimensions: "80 × 60 cm",
    year: 2026,
    framed: true,
    colours: ["indigo", "ivory"],
    room: ["Bedroom", "Office", "Hotel"],
    description:
      "Blue-hour light settles across a high mountain range in a quiet archival edition.",
    images: [IMAGES.art3],
    featured: true,
  },
  {
    slug: "balanced-forms",
    title: "Balanced Forms",
    creatorSlug: "ayla-raza",
    categorySlug: "prints",
    price: 28500,
    currency: "PKR",
    kind: "Open Edition",
    medium: "Fine-art giclée print",
    dimensions: "50 × 65 cm",
    year: 2026,
    framed: false,
    colours: ["terracotta", "ink", "ivory"],
    room: ["Living room", "Bedroom", "Office"],
    description:
      "Geometric forms in ink, stone and terracotta find an easy, architectural balance.",
    images: [IMAGES.art4],
    new: true,
  },
  {
    slug: "pomegranate-study",
    title: "Pomegranate Study",
    creatorSlug: "ayla-raza",
    categorySlug: "prints",
    price: 22000,
    currency: "PKR",
    kind: "Limited Edition",
    editionOf: 40,
    medium: "Watercolour edition on cotton paper",
    dimensions: "45 × 55 cm",
    year: 2025,
    framed: false,
    colours: ["oxblood", "ivory"],
    room: ["Dining room", "Kitchen", "Restaurant"],
    description:
      "A light botanical study of pomegranate branches, printed on softly textured paper.",
    images: [IMAGES.art5],
  },
  {
    slug: "gilded-earth",
    title: "Gilded Earth",
    creatorSlug: "faraz-khan",
    categorySlug: "original-works",
    price: 125000,
    currency: "PKR",
    kind: "Original",
    medium: "Plaster, pigment and gold leaf",
    dimensions: "110 × 90 cm",
    year: 2026,
    framed: false,
    colours: ["oxblood", "ivory", "ink"],
    room: ["Living room", "Hotel", "Restaurant"],
    description: "Layered plaster, mineral red and gold leaf form a tactile, map-like surface.",
    images: [IMAGES.art6],
    featured: true,
  },
];
export const COLLECTIONS: EditorialCollection[] = [
  {
    slug: "the-artdera-edit",
    name: "The ArtDera Edit",
    blurb: "A considered selection of expressive work for contemporary spaces.",
    products: ["gilded-earth", "silence-in-script", "northern-stillness", "balanced-forms"],
    cover: IMAGES.art6,
  },
];

// Room names are presentation filters rather than marketplace records.
export const ROOMS = [
  { slug: "living-room", name: "Living Room", image: IMAGES.heroInterior },
  { slug: "bedroom", name: "Bedroom", image: IMAGES.art1 },
  { slug: "dining", name: "Dining", image: IMAGES.roomDining },
  { slug: "office", name: "Office", image: IMAGES.art4 },
  { slug: "hospitality", name: "Hospitality", image: IMAGES.heroStudio },
  { slug: "small-spaces", name: "Small Spaces", image: IMAGES.art5 },
];

const legacyImageMap: Record<string, string> = {
  "art-1": IMAGES.art1,
  "art-2": IMAGES.art2,
  "art-3": IMAGES.art3,
  "art-4": IMAGES.art4,
  "art-5": IMAGES.art5,
  "art-6": IMAGES.art6,
  "creator-1": IMAGES.creator1,
  "creator-2": IMAGES.creator2,
  "creator-3": IMAGES.creator3,
  "hero-interior": IMAGES.heroInterior,
  "hero-studio": IMAGES.heroStudio,
  "room-dining": IMAGES.roomDining,
};

export function normalizeEditorialImage(
  source: string | undefined,
  fallbackIndex = 0,
  kind: "artwork" | "creator" = "artwork",
) {
  const match = source?.match(
    /(?:^|\/)(art-[1-6]|creator-[1-3]|hero-interior|hero-studio|room-dining)\.(?:jpe?g|png|webp|avif)(?:$|[?#])/i,
  );
  if (match) return legacyImageMap[match[1].toLowerCase()] ?? source!;
  if (source && !source.startsWith("/src/") && !source.startsWith("src/")) return source;
  if (kind === "creator")
    return [IMAGES.creator1, IMAGES.creator2, IMAGES.creator3][fallbackIndex % 3];
  return [IMAGES.art1, IMAGES.art2, IMAGES.art3, IMAGES.art4, IMAGES.art5, IMAGES.art6][
    fallbackIndex % 6
  ];
}

function replace<T>(target: T[], source: T[]) {
  target.splice(0, target.length, ...source);
}

export function hydrateEditorialData(input: {
  categories: Category[];
  creators: Creator[];
  products: Product[];
  collections: EditorialCollection[];
}) {
  if (input.categories.length) replace(CATEGORIES, input.categories);
  if (input.creators.length) replace(CREATORS, input.creators);
  if (input.products.length) replace(PRODUCTS, input.products);
  if (input.collections.length) replace(COLLECTIONS, input.collections);
}

export function getProduct(slug: string) {
  return PRODUCTS.find((product) => product.slug === slug);
}
export function getCreator(slug: string) {
  return CREATORS.find((creator) => creator.slug === slug);
}
export function getCategory(slug: string) {
  return CATEGORIES.find((category) => category.slug === slug);
}
export function productsByCreator(slug: string) {
  return PRODUCTS.filter((product) => product.creatorSlug === slug);
}
export function productsByCategory(slug: string) {
  return PRODUCTS.filter((product) => product.categorySlug === slug);
}
export function formatPKR(value: number) {
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    maximumFractionDigits: 0,
  }).format(value);
}
