import { connectDB } from "../../lib/mongodb";
import Message from "../../models/Message";
import Cors from "cors";

// Initialize the CORS middleware
const cors = Cors({
  origin: "https://mistchat.netlify.app", // Your frontend URL
  methods: ["GET", "POST", "PUT", "DELETE"],
});

// Helper function to run middleware in Next.js
function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }
      return resolve(result);
    });
  });
}

export const POST = async (req) => {
  try {
    // Initialize a mock `res` object for CORS middleware
    const res = {
      status: () => res,
      json: () => res,
      setHeader: () => res,
    };

    // Run the CORS middleware
    await runMiddleware(req, res, cors);

    // Connect to the database
    await connectDB();

    // Parse request body
    const { sender, username, messageText, question } = await req.json();

    // Validate required fields
    if (!sender || !username || !messageText || !question) {
      return new Response(JSON.stringify({ error: "All fields are required." }), { status: 400 });
    }

    // Save the new message to the database
    const newMessage = new Message({ sender, username, messageText, question });
    await newMessage.save();

    // Return success response
    return new Response(JSON.stringify(newMessage), { 
      status: 201, 
      headers: { "Content-Type": "application/json" } 
    });
  } catch (err) {
    console.error("Error saving message:", err);
    return new Response(JSON.stringify({ error: "Failed to save message." }), { status: 500 });
  }
};
