const fs = require('fs');
const path = require('path');

// Read both JSON files
const productsFile = path.join(__dirname, 'public/data/products.json');
const gymNutritionFile = path.join(__dirname, 'public/data/products-gym-nutrition.json');

const products = JSON.parse(fs.readFileSync(productsFile, 'utf8'));
const gymNutrition = JSON.parse(fs.readFileSync(gymNutritionFile, 'utf8'));

// Merge the products arrays
const allProducts = {
  products: [...products.products, ...gymNutrition.products]
};

// Write the combined products to a new file
fs.writeFileSync(
  path.join(__dirname, 'public/data/all-products.json'),
  JSON.stringify(allProducts, null, 2),
  'utf8'
);

console.log('Successfully merged JSON files to public/data/all-products.json');
