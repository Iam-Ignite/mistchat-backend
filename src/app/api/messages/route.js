import { connectDB } from "../../lib/mongodb";
import Message from "../../models/Message";
import { NextResponse } from 'next/server';

// CORS configuration
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': 'https://mistchat.netlify.app/', // Specify the exact origin
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: CORS_HEADERS
  });
}

export async function POST(req) {
  // Handle preflight and actual request with CORS headers
  try {
    await connectDB();
    const { sender, username, messageText, question } = await req.json();

    if (!sender || !username || !messageText || !question) {
      return new NextResponse(JSON.stringify({ error: "All fields are required." }), { 
        status: 400,
        headers: CORS_HEADERS
      });
    }

    const newMessage = new Message({ sender, username, messageText, question });
    await newMessage.save();

    return new NextResponse(JSON.stringify(newMessage), { 
      status: 201, 
      headers: {
        ...CORS_HEADERS,
        "Content-Type": "application/json" 
      } 
    });
  } catch (err) {
    console.error("Error saving message:", err);
    return new NextResponse(JSON.stringify({ error: "Failed to save message." }), { 
      status: 500,
      headers: CORS_HEADERS
    });
  }
}