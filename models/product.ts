import mongoose from "mongoose"

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a product name"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Please provide a product description"],
    },
    longDescription: {
      type: String,
    },
    price: {
      type: Number,
      required: [true, "Please provide a product price"],
      min: 0,
    },
    category: {
      type: String,
      required: [true, "Please provide a product category"],
      enum: ["Sportswear", "Footwear", "Equipment", "Gym", "Nutrition"],
    },
    imageUrl: {
      type: String,
      required: [true, "Please provide a product image URL"],
    },
    stock: {
      type: Number,
      required: [true, "Please provide product stock quantity"],
      min: 0,
      default: 0,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviews: {
      type: Number,
      default: 0,
    },
    discount: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    specifications: [
      {
        name: String,
        value: String,
      },
    ],
  },
  {
    timestamps: true,
  },
)

const Product = mongoose.models.Product || mongoose.model("Product", productSchema)

export default Product
