import { chatWithStartupCoachAI } from '../services/groqService.js';

// @desc    Chat with the Startup Coach
// @route   POST /api/coach/chat
// @access  Private
export const chatWithCoach = async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ message: 'Chat message history is required' });
    }

    const aiReply = await chatWithStartupCoachAI(messages);

    res.json({ reply: aiReply });
  } catch (error) {
    console.error('Coach chat error:', error.message);
    res.status(500).json({ message: 'Failed to process startup coach advice' });
  }
};
