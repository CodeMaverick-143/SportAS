
const fs = require('fs');
const { MongoClient } = require('mongodb');

async function testConnection() {
  console.log('🔄 Testing direct MongoDB connection...');
  
  // Read MONGO_URI from .env.local
  let uri = '';
  try {
    const envContent = fs.readFileSync('.env.local', 'utf8');
    const mongoLine = envContent.split('\n').find(line => line.startsWith('MONGO_URI='));
    if (mongoLine) {
      uri = mongoLine.split('=')[1].trim();
      if ((uri.startsWith('"') && uri.endsWith('"')) || 
          (uri.startsWith("'") && uri.endsWith("'"))) {
        uri = uri.substring(1, uri.length - 1);
      }
    }
  } catch (err) {
    console.error('❌ Error reading .env.local:', err.message);
    process.exit(1);
  }
  
  if (!uri) {
    console.error('❌ MONGO_URI not found in .env.local file');
    process.exit(1);
  }
  let cleanUri = uri;
  if (uri.includes('?')) {
    const [baseUri, queryParams] = uri.split('?');
    const params = queryParams.split('&')
      .filter(param => !param.startsWith('retryWrites'))
      .join('&');
    
    cleanUri = params.length > 0 ? `${baseUri}?${params}` : baseUri;
  }
  
  console.log(`Original URI starts with: ${uri.substring(0, 20)}...`);
  console.log(`Cleaned URI starts with: ${cleanUri.substring(0, 20)}...`);
  
  const client = new MongoClient(cleanUri, {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  });
  
  try {
    console.log('Connecting to MongoDB...');
    await client.connect();
    console.log('✅ Connected successfully to MongoDB!');
    const dbs = await client.db().admin().listDatabases();
    console.log('\n📊 Available databases:');
    dbs.databases.forEach(db => {
      console.log(`- ${db.name}`);
    });
    const dbName = cleanUri.split('/').pop().split('?')[0];
    console.log(`\n🔍 Examining database: ${dbName}`);
    
    const collections = await client.db(dbName).listCollections().toArray();
    console.log('📊 Collections:');
    collections.forEach(collection => {
      console.log(`- ${collection.name}`);
    });
    
    // Check for users
    const usersCollection = collections.find(c => c.name === 'users');
    if (usersCollection) {
      const userCount = await client.db(dbName).collection('users').countDocuments();
      console.log(`\n👤 User collection found with ${userCount} documents`);
    } else {
      console.log('\n❌ Users collection not found');
    }
    
    // Check for products
    const productsCollection = collections.find(c => c.name === 'products');
    if (productsCollection) {
      const productCount = await client.db(dbName).collection('products').countDocuments();
      console.log(`\n📦 Products collection found with ${productCount} documents`);
    } else {
      console.log('\n❌ Products collection not found');
    }
    
    console.log('\n✅ Database connection test completed successfully');
    return { cleanUri };
    
  } catch (err) {
    console.error('❌ MongoDB connection error:', err);
    return null;
  } finally {
    await client.close();
    console.log('🔌 Connection closed');
  }
}

// Run the test
testConnection()
  .then(result => {
    if (result) {
      // Update the .env.local file with the cleaned URI if needed
      if (result.cleanUri) {
        try {
          let envContent = fs.readFileSync('.env.local', 'utf8');
          const lines = envContent.split('\n');
          const updatedLines = lines.map(line => {
            if (line.startsWith('MONGO_URI=')) {
              return `MONGO_URI="${result.cleanUri}"`;
            }
            return line;
          });
          
          fs.writeFileSync('.env.local.bak', envContent, 'utf8');
          fs.writeFileSync('.env.local', updatedLines.join('\n'), 'utf8');
          console.log('\n✅ Updated .env.local with cleaned MongoDB URI');
          console.log('Original .env.local backed up to .env.local.bak');
        } catch (err) {
          console.error('❌ Error updating .env.local file:', err.message);
        }
      }
    }
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Test failed with error:', err);
    process.exit(1);
  });
