import { connectDB } from "../../../lib/mongodb";
import Message from "../../../models/Message";

export const PUT = async (req, { params }) => {
  try {
    await connectDB();
    const { id } = params;
    const { isOpen } = await req.json();

    if (typeof isOpen !== "boolean") {
      return new Response(JSON.stringify({ error: "Invalid value for isOpen. It must be a boolean." }), { status: 400 });
    }

    const updatedMessage = await Message.findByIdAndUpdate(id, { isOpen }, { new: true });

    if (!updatedMessage) {
      return new Response(JSON.stringify({ error: "Message not found." }), { status: 404 });
    }

    return new Response(JSON.stringify({ message: "Message updated successfully.", data: updatedMessage }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Error updating message:", err);
    return new Response(JSON.stringify({ error: "Failed to update message." }), { status: 500 });
  }
};
