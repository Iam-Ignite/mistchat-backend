import { connectDB } from "../../lib/mongodb";
import Message from "../../models/Message";

export const POST = async (req) => {
  try {
    await connectDB();
    const { sender, username, messageText, question } = await req.json();

    if (!sender || !username || !messageText || !question) {
      return new Response(JSON.stringify({ error: "All fields are required." }), { status: 400 });
    }

    const newMessage = new Message({ sender, username, messageText, question });
    await newMessage.save();

    return new Response(JSON.stringify(newMessage), { status: 201, headers: { "Content-Type": "application/json" } });
  } catch (err) {
    console.error("Error saving message:", err);
    return new Response(JSON.stringify({ error: "Failed to save message." }), { status: 500 });
  }
};
