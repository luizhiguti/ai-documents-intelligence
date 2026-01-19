import mongoose from "mongoose";

let isConnected = false;

export async function connectMongo() {
  if (isConnected) return;

  const uri = process.env.MONGO_URI;

  if (!uri) {
    throw new Error("MONGO_URI is not defined");
  }

  try {
    await mongoose.connect(uri);

    isConnected = true;

    console.log("MongoDB connected successfully");
  } catch (error) {
    console.log("MongoDB connection error: ", error);
    throw error;
  }
}

export function mongoHealth() {
  const state = mongoose.connection.readyState;

  // 0 - disconnected
  // 1 - connected
  // 2 - connecting
  // 3 - disconnecting

  return { state, isConnected: state === 1 };
}
