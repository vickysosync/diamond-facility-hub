import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "";
const MONGODB_DB_NAME = process.env.MONGODB_DB_NAME || "diamond_facility";

if (!MONGODB_URI) {
  console.warn("Please define MONGODB_URI in your .env file");
}

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var mongooseCache: MongooseCache | undefined;
}

let cached = global.mongooseCache;

if (!cached) {
  cached = global.mongooseCache = { conn: null, promise: null };
}

export async function connectToDatabase(): Promise<typeof mongoose> {
  if (cached?.conn) {
    return cached.conn;
  }

  if (!cached?.promise) {
    const opts: mongoose.ConnectOptions = {
      bufferCommands: false,
      dbName: MONGODB_DB_NAME,
    };

    cached!.promise = mongoose.connect(MONGODB_URI, opts).then((m) => {
      console.log(`Connected to MongoDB Atlas: ${MONGODB_DB_NAME}`);
      return m;
    });
  }

  try {
    cached!.conn = await cached!.promise;
  } catch (e) {
    cached!.promise = null;
    console.error("MongoDB Atlas connection error:", e);
    throw e;
  }

  return cached!.conn;
}

export default connectToDatabase;
