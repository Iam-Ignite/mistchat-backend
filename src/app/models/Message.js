import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
  sender: { type: String, required: true },
  username: { type: String, required: true },
  messageText: { type: String, required: true },
  question: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  isOpen: { type: Boolean, default: false },
});

const Message = mongoose.models.Message || mongoose.model("Message", MessageSchema);

export default Message;
