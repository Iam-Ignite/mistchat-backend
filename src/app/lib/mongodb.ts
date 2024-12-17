import mongoose from "mongoose";

const mongoURI = 'mongodb+srv://feels:TnvDHNKQASQ5yJ6I@cluster0.nzw0a.mongodb.net/messagesApp?retryWrites=true&w=majority';

export const connectDB = async () => {
  if (mongoose.connection.readyState === 1) return mongoose.connection.asPromise();

  try {
    await mongoose.connect(mongoURI);
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw new Error("Failed to connect to MongoDB");
  }
};
