import mongoose from "mongoose";

let isConnecting = false;

export async function connectDB() {
  const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/fashioncycle";
  
  if (isConnecting || mongoose.connection.readyState === 1) return;
  isConnecting = true;

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 4000,
    });
    console.log(`🌿 MongoDB Connected Successfully: ${conn.connection.host}/${conn.connection.name}`);
    isConnecting = false;
    return conn;
  } catch (error) {
    console.warn(`⚠️ MongoDB Connection Notice: ${error.message}`);
    console.warn("💡 Tip: Start local MongoDB daemon (e.g., 'brew services start mongodb-community' or 'mongod')");
    isConnecting = false;

    // Retry connection in background every 6 seconds without crashing the server
    setTimeout(() => {
      connectDB().catch(() => {});
    }, 6000);
  }
}
