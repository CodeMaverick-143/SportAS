const fs = require('fs')
const mongoose = require('mongoose')
let MONGO_URI = ''
try {
  const envContent = fs.readFileSync('.env.local', 'utf8')
  const mongoLine = envContent.split('\n').find(line => line.startsWith('MONGO_URI='))
  if (mongoLine) {
    MONGO_URI = mongoLine.split('=')[1].trim()
    if ((MONGO_URI.startsWith('"') && MONGO_URI.endsWith('"')) ||
        (MONGO_URI.startsWith('\'') && MONGO_URI.endsWith('\'')))
    {
      MONGO_URI = MONGO_URI.substring(1, MONGO_URI.length - 1)
    }
  }
} catch (err) {
  console.error('❌ ERROR: Could not read .env.local file:', err.message)
}

if (!MONGO_URI) {
  console.error('❌ ERROR: MongoDB connection string not found in .env.local!')
  console.error('Please make sure you have MONGO_URI in your .env.local file')
  process.exit(1)
}

async function testConnection() {
  console.log('🔄 Testing MongoDB connection...')
  console.log(`MongoDB URI: ${MONGO_URI.substring(0, 15)}...`)
  
  try {
    await mongoose.connect(MONGO_URI, {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000
    })
    
    console.log('✅ MongoDB connected successfully!')
    
    const collections = await mongoose.connection.db.listCollections().toArray()
    console.log('\n📊 Available collections:')
    collections.forEach(collection => {
      console.log(`- ${collection.name}`)
    })
    
    console.log('\n🔍 Checking for User collection...')
    const userCollection = collections.find(c => c.name === 'users')
    if (userCollection) {
      console.log('✅ User collection found')
      
      // Count users
      const userCount = await mongoose.connection.db.collection('users').countDocuments()
      console.log(`📊 Total users: ${userCount}`)
    } else {
      console.log('❌ User collection not found')
    }
    
    console.log('\n🔍 Checking for Product collection...')
    const productCollection = collections.find(c => c.name === 'products')
    if (productCollection) {
      console.log('✅ Product collection found')
      

      const productCount = await mongoose.connection.db.collection('products').countDocuments()
      console.log(`📊 Total products: ${productCount}`)
    } else {
      console.log('❌ Product collection not found')
    }
    
  } catch (error) {
    console.error('❌ MongoDB connection error:', error)
  } finally {

    await mongoose.disconnect()
    console.log('\n🔌 MongoDB connection closed')
  }
}

testConnection()
  .then(() => {
    console.log('\n✅ Test completed')
    process.exit(0)
  })
  .catch(err => {
    console.error('❌ Test failed:', err)
    process.exit(1)
  })
