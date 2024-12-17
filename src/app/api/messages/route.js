import { connectDB } from "../../lib/mongodb";
import Message from "../../models/Message";

export const POST = async (req) => {
  try {
    // Set CORS headers directly
    const headers = {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "https://mistchat.netlify.app", // Replace with your frontend's URL
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    // Handle preflight requests (CORS pre-check)
    if (req.method === "OPTIONS") {
      return new Response(null, {
        status: 204, // No content
        headers,
      });
    }

    // Connect to the database
    await connectDB();

    // Parse request body
    const { sender, username, messageText, question } = await req.json();

    // Validate required fields
    if (!sender || !username || !messageText || !question) {
      return new Response(JSON.stringify({ error: "All fields are required." }), {
        status: 400,
        headers,
      });
    }

    // Save the new message to the database
    const newMessage = new Message({ sender, username, messageText, question });
    await newMessage.save();

    // Return success response
    return new Response(JSON.stringify(newMessage), {
      status: 201,
      headers,
    });
  } catch (err) {
    console.error("Error saving message:", err);
    return new Response(JSON.stringify({ error: "Failed to save message." }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
};
