export interface Product {
  slug: string;
  name: string;
  price: number; // cents
  tagline: string;
  description: string;
  emoji: string;
  gradient: string; // tailwind gradient classes for the image placeholder
  category: "planters" | "tools" | "care" | "decor";
  stock: number;
}

export const PRODUCTS: Product[] = [
  {
    slug: "terracotta-planter",
    name: "Classic Terracotta Planter",
    price: 2400,
    tagline: "The pot every plant deserves",
    description:
      "Hand-thrown terracotta with a drainage hole and matching saucer. Breathable clay keeps roots healthy and forgives the occasional over-watering.",
    emoji: "🪴",
    gradient: "from-orange-200 to-rose-300",
    category: "planters",
    stock: 42,
  },
  {
    slug: "ceramic-planter-white",
    name: "Matte Ceramic Planter",
    price: 3800,
    tagline: "Minimal, matte, modern",
    description:
      "A clean-lined stoneware planter with a soft matte glaze. Includes a cork mat to protect shelves and windowsills.",
    emoji: "🏺",
    gradient: "from-slate-200 to-zinc-300",
    category: "planters",
    stock: 27,
  },
  {
    slug: "hanging-macrame",
    name: "Macramé Plant Hanger",
    price: 1900,
    tagline: "Give your plants some air",
    description:
      "Hand-knotted cotton hanger that fits pots up to 8 inches. Turns any curtain rod or ceiling hook into a jungle.",
    emoji: "🪢",
    gradient: "from-amber-100 to-yellow-200",
    category: "decor",
    stock: 63,
  },
  {
    slug: "pruning-shears",
    name: "Precision Pruning Shears",
    price: 3200,
    tagline: "Clean cuts, happy plants",
    description:
      "Japanese carbon-steel blades with a spring-loaded grip. Sharp enough for woody stems, gentle enough for herbs.",
    emoji: "✂️",
    gradient: "from-emerald-200 to-teal-300",
    category: "tools",
    stock: 35,
  },
  {
    slug: "watering-can-copper",
    name: "Copper Watering Can",
    price: 5400,
    tagline: "One litre of intention",
    description:
      "A slim-spout copper can that reaches through dense foliage without splashing. Ages into a beautiful patina.",
    emoji: "🫖",
    gradient: "from-amber-200 to-orange-300",
    category: "tools",
    stock: 18,
  },
  {
    slug: "potting-mix",
    name: "Small-Batch Potting Mix",
    price: 1600,
    tagline: "The good dirt",
    description:
      "Five litres of airy, well-draining mix with coco coir, perlite, and worm castings. Suits most tropical houseplants.",
    emoji: "🌱",
    gradient: "from-lime-200 to-green-300",
    category: "care",
    stock: 88,
  },
  {
    slug: "grow-light",
    name: "Full-Spectrum Grow Light",
    price: 6900,
    tagline: "Sunshine on a cord",
    description:
      "A warm-white LED panel tuned for photosynthesis, with a timer and three intensity levels. Dark corners are no excuse.",
    emoji: "💡",
    gradient: "from-yellow-100 to-amber-200",
    category: "care",
    stock: 21,
  },
  {
    slug: "mister-glass",
    name: "Amber Glass Mister",
    price: 1400,
    tagline: "A fine mist for fine leaves",
    description:
      "Vintage-style amber glass with a fine brass nozzle. For ferns, calatheas, and anyone who likes humidity theatre.",
    emoji: "💨",
    gradient: "from-amber-100 to-orange-200",
    category: "care",
    stock: 54,
  },
];

export function getProduct(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}
