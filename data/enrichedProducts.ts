// Using Partial<Product> for seed data to allow MongoDB to generate _id
import type { Product } from "@/types"

type ProductSeed = Omit<Product, '_id' | 'createdAt'> & { createdAt?: string }

// Generate a random date within the last 6 months
const generateDate = () => {
  const now = new Date()
  const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 6, now.getDate())
  const randomTime = sixMonthsAgo.getTime() + Math.random() * (now.getTime() - sixMonthsAgo.getTime())
  return new Date(randomTime).toISOString()
}

// Generate a specific number of products for each category
const generateCategoryProducts = (
  category: string,
  baseNames: string[],
  priceRange: [number, number],
  count: number
): ProductSeed[] => {
  const products: ProductSeed[] = []
  
  for (let i = 0; i < count; i++) {
    // Cycle through baseNames if we need more products than we have baseNames
    const baseName = baseNames[i % baseNames.length]
    // Add a suffix to create unique names if needed
    const name = i >= baseNames.length ? `${baseName} - Model ${Math.floor(i / baseNames.length) + 1}` : baseName
    
    // Generate random price in the given range
    const price = Math.floor(priceRange[0] + Math.random() * (priceRange[1] - priceRange[0]))
    
    products.push({
      name,
      description: `High-quality ${category.toLowerCase()} product for sports enthusiasts.`,
      price,
      category,
      imageUrl: "/placeholder.svg?height=400&width=400",
      stock: Math.floor(10 + Math.random() * 90),
      rating: Math.floor(30 + Math.random() * 20) / 10, // 3.0 to 5.0
      reviews: Math.floor(10 + Math.random() * 190),
      discount: Math.random() > 0.7 ? Math.floor(5 + Math.random() * 20) : 0,
      featured: Math.random() > 0.8,
      createdAt: generateDate(),
    })
  }
  
  return products
}

// Define base names for each category
const sportswearNames = [
  "Men's Dri-FIT Training T-Shirt", "Women's Performance Leggings", "Men's Running Shorts", 
  "Women's Sports Bra", "Unisex Compression Arm Sleeves", "Men's Track Pants", 
  "Women's Yoga Tops", "Performance Polo Shirt", "Training Hoodie", "Compression Shorts",
  "Thermal Base Layer", "Running Jacket", "Women's Fitness Tank", "Sport Sweatshirts",
  "Windbreaker Jacket", "Athletic Socks", "Sports Headband", "Quick-Dry Workout Shirt",
  "Performance Sweatpants", "Breathable Training Shorts", "Moisture-Wicking Singlet",
  "UV Protection Running Sleeves", "Athletic Zip-Up Jacket", "Men's Compression Tights",
  "Women's Running Skirt", "Training Vest", "Sport Gloves", "Heat-Retention Tights",
  "Reflective Running Vest", "Lightweight Training Cap"
]

const footwearNames = [
  "Men's Running Shoes", "Women's Cross-Training Shoes", "Basketball High-Tops", 
  "Tennis Court Shoes", "Trail Running Shoes", "Indoor Soccer Shoes", 
  "Weightlifting Shoes", "Hiking Boots", "Athletic Walking Shoes", "Sports Sandals",
  "Cycling Shoes", "Cricket Spikes", "Wrestling Boots", "Golf Shoes",
  "Badminton Court Shoes", "Boxing Boots", "Marathon Racing Flats", "CrossFit Training Shoes",
  "Volleyball Court Shoes", "Baseball Cleats", "Skateboarding Shoes", "Track & Field Spikes",
  "Rugby Boots", "Racquetball Shoes", "Slip-On Water Shoes", "Aerobic Training Shoes",
  "Squash Court Shoes", "Bowling Shoes", "Football Cleats", "Table Tennis Shoes"
]

const equipmentNames = [
  "Adjustable Dumbbell Set", "Yoga Mat", "Basketball", "Tennis Racket", 
  "Resistance Band Set", "Pull-Up Bar", "Jump Rope", "Soccer Ball", 
  "Medicine Ball", "Kettlebell", "Treadmill", "Exercise Bike",
  "Rowing Machine", "Weight Bench", "TRX Suspension Trainer", "Battle Ropes",
  "Boxing Gloves", "Cricket Bat", "Football", "Volleyball",
  "Badminton Racket", "Table Tennis Paddle", "Hockey Stick", "Golf Club Set",
  "Balance Ball", "Agility Ladder", "Ab Roller", "Weight Plate Set",
  "Barbell Set", "Punching Bag"
]

const gymNames = [
  "Power Rack", "Multi-Gym Station", "Adjustable Bench Press", "Leg Press Machine",
  "Cable Crossover Machine", "Smith Machine", "Lat Pulldown Machine", "Leg Extension Machine",
  "Preacher Curl Bench", "Seated Row Machine", "Chest Press Machine", "Ab Crunch Machine",
  "Hip Abduction Machine", "Functional Trainer", "Pull-Up/Dip Station", "Leg Curl Machine",
  "Hack Squat Machine", "T-Bar Row Machine", "Shoulder Press Machine", "Pec Deck Machine",
  "Calf Raise Machine", "Hyperextension Bench", "Glute Ham Developer", "Ab Bench",
  "Arm Curl Machine", "Seated Calf Machine", "Squat Rack", "Olympic Weight Bench",
  "Assisted Pull-Up Machine", "Vertical Knee Raise Station"
]

const nutritionNames = [
  "Whey Protein Powder", "Plant-Based Protein", "Pre-Workout Supplement", "BCAA Powder", 
  "Creatine Monohydrate", "Protein Bars", "Mass Gainer", "Multivitamin Complex",
  "Omega-3 Fish Oil", "Glutamine Powder", "Energy Gels", "Electrolyte Drink Mix",
  "Collagen Peptides", "Casein Protein", "Nitric Oxide Booster", "CLA Supplements",
  "Beta-Alanine", "ZMA Supplement", "Protein Cookie", "Amino Energy Drink",
  "Greens Supplement", "Protein Chips", "Vitamin D3", "Magnesium Citrate",
  "L-Carnitine", "Meal Replacement Shake", "Ashwagandha Extract", "Turmeric Curcumin",
  "Protein Coffee", "Energy Chews"
]

// Generate 30 products for each category
export const enrichedProducts: ProductSeed[] = [
  ...generateCategoryProducts("Sportswear", sportswearNames, [499, 3999], 30),
  ...generateCategoryProducts("Footwear", footwearNames, [1999, 7999], 30),
  ...generateCategoryProducts("Equipment", equipmentNames, [299, 15999], 30),
  ...generateCategoryProducts("Gym", gymNames, [3999, 89999], 30),
  ...generateCategoryProducts("Nutrition", nutritionNames, [299, 3999], 30)
]

// Export the products
export default enrichedProducts
