const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Initialize app and middleware
const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
const mongoURI = 'mongodb+srv://feels:TnvDHNKQASQ5yJ6I@cluster0.nzw0a.mongodb.net/messagesApp?retryWrites=true&w=majority';
mongoose.connect(mongoURI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);  // Ensure server doesn't start if DB connection fails
  });

// Define the Message schema and model
const MessageSchema = new mongoose.Schema({
  sender: { type: String, required: true },
  username: { type: String, required: true },
  messageText: { type: String, required: true, minlength: 1 },
  question: { type: String, required: true, minlength: 1 },
  timestamp: { type: Date, default: Date.now },
  isOpen: { type: Boolean, default: false },
});

const Message = mongoose.model('messages', MessageSchema);

// API Endpoints

// Get the question for a user
app.get('/api/questions/:username', async (req, res) => {
  try {
    const { username } = req.params; // Get the username from the URL parameters
    
    // Find the messages/questions for this username
    const questions = await Message.find({ username });

    if (questions.length === 0) {
      return res.status(404).json({ message: 'No questions found for this username.' });
    }

    // Map the messages to only include the relevant question data
    const userQuestions = questions.map((message) => ({
      id: message._id,
      question: message,  // Only include the question field
    }));

    res.status(200).json(userQuestions); // Return the questions for the specific username
  } catch (err) {
    console.error('Error fetching questions:', err);
    res.status(500).json({ error: 'Failed to fetch questions.' });
  }
});

// Save a new message
app.post('/api/messages', async (req, res) => {
  try {
    const { sender, username, messageText, question } = req.body;

    if (!sender || !username || !messageText || !question) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    const newMessage = new Message({
      sender,
      username,
      messageText,
      question,
      timestamp: new Date(),
    });

    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (err) {
    console.error('Error saving message:', err);
    res.status(500).json({ error: 'Failed to save message.' });
  }
});

// Start the server
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
