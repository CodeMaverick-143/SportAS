import type { Product } from "@/types"

// Generate a random ID
const generateId = () => Math.random().toString(36).substring(2, 15)
// Generate a random date within the last 6 months
const generateDate = () => {
  const now = new Date()
  const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 6, now.getDate())
  const randomTime = sixMonthsAgo.getTime() + Math.random() * (now.getTime() - sixMonthsAgo.getTime())
  return new Date(randomTime).toISOString()
}

// SIMPLIFIED PRODUCT LIST - Reduced to 10 products (2 per category)
export const products: Product[] = [
  // SPORTSWEAR - 2 items
  {
    _id: "sport1",
    name: "Men's Dri-FIT Training T-Shirt",
    description: "Lightweight and breathable training t-shirt with moisture-wicking technology.",
    longDescription: "This premium training t-shirt features advanced moisture-wicking technology to keep you dry during intense workouts. The lightweight fabric allows for maximum mobility while the breathable design ensures comfort throughout your training session. Perfect for gym sessions, running, or casual wear.",
    price: 1299,
    category: "Sportswear",
    // IMAGE URL: Change this path to your custom image
    imageUrl: "https://images.unsplash.com/photo-1593032465171-b1d7ca94687e", 
    stock: 45,
    rating: 4.5,
    reviews: 128,
    discount: 0,
    featured: true,
    specifications: [
      { name: "Material", value: "88% Polyester, 12% Elastane" },
      { name: "Fit", value: "Regular" },
      { name: "Care", value: "Machine wash cold" },
    ],
    createdAt: generateDate(),
  },
  {
    _id: "sport2",
    name: "Women's Performance Leggings",
    description: "High-waisted compression leggings with four-way stretch fabric.",
    price: 1899,
    category: "Sportswear",
    // IMAGE URL: Change this path to your custom image
    imageUrl: "https://images.unsplash.com/photo-1600185365483-26f0dc93a9b3",
    stock: 32,
    rating: 4.7,
    reviews: 95,
    discount: 15,
    featured: true,
    createdAt: generateDate(),
  },

  // FOOTWEAR - 2 items
  {
    _id: "foot1",
    name: "Men's Running Shoes",
    description: "Lightweight running shoes with responsive cushioning and breathable mesh upper.",
    longDescription: "Experience superior comfort and performance with these premium running shoes. The responsive cushioning absorbs impact while providing energy return with each stride. The breathable mesh upper keeps your feet cool, and the durable rubber outsole offers excellent traction on various surfaces. Ideal for daily runs, training sessions, or marathon preparation.",
    price: 4999,
    category: "Footwear",
    // IMAGE URL: Change this path to your custom image
    imageUrl: "https://images.unsplash.com/photo-1620176430460-93b35792a75c",
    stock: 25,
    rating: 4.8,
    reviews: 156,
    discount: 0,
    featured: true,
    specifications: [
      { name: "Upper", value: "Engineered mesh" },
      { name: "Midsole", value: "Responsive foam" },
      { name: "Outsole", value: "Rubber" },
      { name: "Weight", value: "255g (Men's size 9)" },
    ],
    createdAt: generateDate(),
  },
  {
    _id: "foot2",
    name: "Basketball High-Tops",
    description: "High-top basketball shoes with ankle support and cushioned midsole for explosive movements.",
    price: 5499,
    category: "Footwear",
    // IMAGE URL: Change this path to your custom image
    imageUrl: "https://images.unsplash.com/photo-1625592762492-04b51b2a1f65",
    stock: 15,
    rating: 4.7,
    reviews: 78,
    discount: 0,
    featured: false,
    createdAt: generateDate(),
  },

  // EQUIPMENT - 2 items
  {
    _id: "equip1",
    name: "Adjustable Dumbbell Set",
    description: "Space-saving adjustable dumbbells with weight range from 2.5kg to 25kg per dumbbell.",
    longDescription: "Transform your home gym with this versatile adjustable dumbbell set. Each dumbbell can be quickly adjusted from 2.5kg to 25kg with a simple dial mechanism, replacing 15 pairs of traditional dumbbells. The compact design saves valuable space while providing a complete range of weight options for various exercises. The durable construction ensures long-lasting performance for years of workouts.",
    price: 12999,
    category: "Equipment",
    // IMAGE URL: Change this path to your custom image
    imageUrl: "https://images.unsplash.com/photo-1565374780-42d98e56b8f9",
    stock: 8,
    rating: 4.9,
    reviews: 112,
    discount: 0,
    featured: true,
    specifications: [
      { name: "Weight Range", value: "2.5kg to 25kg per dumbbell" },
      { name: "Increments", value: "2.5kg" },
      { name: "Material", value: "Steel with rubber-coated handles" },
      { name: "Dimensions", value: "40cm x 20cm x 20cm (per dumbbell)" },
    ],
    createdAt: generateDate(),
  },
  {
    _id: "equip2",
    name: "Yoga Mat",
    description: "Non-slip yoga mat with alignment lines and eco-friendly TPE material.",
    price: 1799,
    category: "Equipment",
    // IMAGE URL: Change this path to your custom image
    imageUrl: "https://images.unsplash.com/photo-1533320371471-c5c13b79a328",
    stock: 35,
    rating: 4.7,
    reviews: 89,
    discount: 10,
    featured: true,
    createdAt: generateDate(),
  },

  // GYM - 2 items
  {
    _id: "gym1",
    name: "Power Rack with Pull-up Bar",
    description: "Heavy-duty power rack with multiple safety positions and integrated pull-up bar.",
    longDescription: "Elevate your home gym with this commercial-grade power rack. The sturdy steel construction supports heavy loads for squats, bench press, and other compound movements. Multiple safety pin positions allow for safe solo training, while the integrated pull-up bar adds versatility to your workout routine. The wide base ensures stability even during the most intense lifting sessions.",
    price: 24999,
    category: "Gym",
    // IMAGE URL: Change this path to your custom image
    imageUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48",
    stock: 5,
    rating: 4.9,
    reviews: 65,
    discount: 0,
    featured: true,
    specifications: [
      { name: "Material", value: "Heavy-gauge steel" },
      { name: "Weight Capacity", value: "450kg" },
      { name: "Dimensions", value: "120cm x 120cm x 215cm" },
      { name: "Pull-up Bar Height", value: "210cm" },
    ],
    createdAt: generateDate(),
  },
  {
    _id: "gym2",
    name: "Kettlebell Set",
    description: "Set of 3 vinyl-coated kettlebells (8kg, 12kg, 16kg) for functional strength training.",
    price: 4999,
    category: "Gym",
    // IMAGE URL: Change this path to your custom image
    imageUrl: "https://images.unsplash.com/photo-1517344884110-96a9e85297b5",
    stock: 18,
    rating: 4.6,
    reviews: 42,
    discount: 10,
    featured: false,
    createdAt: generateDate(),
  },

  // NUTRITION - 2 items
  {
    _id: "nut1",
    name: "Whey Protein Isolate - 1kg",
    description: "Premium whey protein isolate with 27g protein per serving and minimal carbs and fat.",
    longDescription: "Fuel your muscle recovery with this premium whey protein isolate. Each serving delivers 27g of high-quality protein with minimal carbs and fat, making it ideal for supporting muscle growth and recovery. The advanced filtration process ensures maximum purity and digestibility. Available in multiple flavors, this protein powder mixes easily with water or milk for a delicious post-workout shake.",
    price: 2999,
    category: "Nutrition",
    // IMAGE URL: Change this path to your custom image
    imageUrl: "https://images.unsplash.com/photo-1593095948071-474c5cc2989d",
    stock: 25,
    rating: 4.8,
    reviews: 175,
    discount: 0,
    featured: true,
    specifications: [
      { name: "Protein per serving", value: "27g" },
      { name: "Servings", value: "33" },
      { name: "Flavors", value: "Chocolate, Vanilla, Strawberry" },
      { name: "Allergens", value: "Contains milk. Produced in a facility that processes soy and egg." },
    ],
    createdAt: generateDate(),
  },
  {
    _id: "nut2",
    name: "Creatine Monohydrate - 500g",
    description: "Pure creatine monohydrate powder for strength and power enhancement.",
    price: 999,
    category: "Nutrition",
    // IMAGE URL: Change this path to your custom image
    imageUrl: "https://images.unsplash.com/photo-1627467959547-8e66e50f0af5",
    stock: 40,
    rating: 4.7,
    reviews: 105,
    discount: 0,
    featured: false,
    createdAt: generateDate(),
  },
]
