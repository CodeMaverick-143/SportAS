import mongoose from "mongoose"

const MONGO_URI = process.env.MONGO_URI || ""

if (!MONGO_URI) {
  console.error("MongoDB connection string not found in environment variables!")
  console.error("Please add MONGO_URI to your .env.local file")
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongoose: MongooseCache | undefined;
}

let cached: MongooseCache = global.mongoose || { conn: null, promise: null }

if (!global.mongoose) {
  global.mongoose = cached
}

export async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000
    }

    console.log("Connecting to MongoDB...")
    
    if (MONGO_URI) {
      console.log(`MongoDB URI format: ${MONGO_URI.substring(0, 12)}...${MONGO_URI.includes('?') ? ' (includes query params)' : ''}`)
    }
    
    cached.promise = mongoose.connect(MONGO_URI, opts)
      .then((mongoose) => {
        console.log("MongoDB connected successfully")
        return mongoose
      })
      .catch((err) => {
        console.error("MongoDB connection error:", err)
        cached.promise = null
        throw err
      })
  }

  try {
    cached.conn = await cached.promise
    return cached.conn
  } catch (e) {
    console.error("Failed to connect to MongoDB:", e)
    cached.promise = null
    throw e
  }

  return cached.conn
}
