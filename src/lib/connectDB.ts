import mongoose from 'mongoose'

const MONGO_URI = process.env.MONGO_URI

const cached: {
  connection?: typeof mongoose
  promise?: Promise<typeof mongoose>
} = {}

export async function connectDB() {
  if (!MONGO_URI) {
    throw new Error(
      'Database connection failed. Please check your environment variables.'
    )
  }
  if (cached.connection) {
    return cached.connection
  }
  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    }
    cached.promise = mongoose.connect(MONGO_URI, opts)
  }
  try {
    cached.connection = await cached.promise
  } catch (e) {
    cached.promise = undefined
    throw e
  }
  return cached.connection
}
