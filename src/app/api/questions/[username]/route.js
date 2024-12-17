import { connectDB } from "../../../lib/mongodb";
import Message from "../../../models/Message";


export const GET = async (req, { params }) => {
  try {
    await connectDB();
    const { username } = params;

    const questions = await Message.find({ username });

    if (questions.length === 0) {
      return new Response(JSON.stringify({ message: "No questions found for this username." }), { status: 404 });
    }

    const userQuestions = questions.map(({ _id, question }) => ({ id: _id, question }));

    return new Response(JSON.stringify(userQuestions), { headers: { "Content-Type": "application/json" } });
  } catch (err) {
    console.error("Error fetching questions:", err);
    return new Response(JSON.stringify({ error: "Failed to fetch questions." }), { status: 500 });
  }
};
