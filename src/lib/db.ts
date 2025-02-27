import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI!

if (!MONGODB_URI) {
  throw new Error('MONGODB_URI is not set')
}

let cached = global.mongoose

if (!cached) {
  cached = global.mongoose = {
    conn: null,
    promise: null
  }
}

async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    const options = {
      bufferCommands: true,
      maxPoolSize: 5
    }

    cached.promise = mongoose
      .connect(MONGODB_URI, options)
      .then(() => mongoose.connection)
  }

  try {
    cached.conn = await cached.promise
  } catch (error) {
    console.log('Error(caching DB connection):', error)
    cached.promise = null
  }

  return cached.conn
}

export default connectToDatabase
