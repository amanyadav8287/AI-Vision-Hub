/**
 * Chat Service — contextual Q&A about a scan.
 */

const Chat = require("../models/Chat");
const Scan = require("../models/Scan");
const aiService = require("./aiService");
const { AppError } = require("../middleware/errorMiddleware");

/**
 * Ask a question about an existing scan.
 * Persists the conversation (user + assistant messages).
 */
async function askQuestion({ userId, scanId, message }) {
  const scan = await Scan.findOne({ _id: scanId, userId });
  if (!scan) throw new AppError("Scan not found", 404);
  if (scan.processingStatus !== "completed") {
    throw new AppError("Scan is not ready for chat yet", 400);
  }

  // Load or create the conversation for this scan
  let chat = await Chat.findOne({ userId, scanId });
  if (!chat) {
    chat = await Chat.create({ userId, scanId, messages: [] });
  }

  // Append user message
  chat.messages.push({
    role: "user",
    content: message,
    timestamp: new Date(),
  });

  // Build a compact scan context to send to the AI (avoid sending the whole blob)
  const scanContext = {
    id: scan._id,
    mode: scan.mode,
    detectedItem: scan.detectedItem,
    confidence: scan.confidence,
    category: scan.category,
    result: scan.result || {},
  };

  // Conversation history (last 10 turns to keep context window sane)
  const conversation = chat.messages
    .slice(-20)
    .map((m) => ({ role: m.role, content: m.content }));

  // Ask the AI
  const aiReply = await aiService.askAboutScan({
    scanContext,
    conversation,
    question: message,
  });

  chat.messages.push({
    role: "assistant",
    content: aiReply.reply || "",
    timestamp: new Date(),
  });

  await chat.save();

  return {
    reply: aiReply.reply,
    timestamp: chat.messages[chat.messages.length - 1].timestamp,
    chat,
  };
}

/**
 * Get full chat history for a scan (scoped to the user).
 */
async function getChat({ userId, scanId }) {
  const scan = await Scan.findOne({ _id: scanId, userId });
  if (!scan) throw new AppError("Scan not found", 404);
  const chat = await Chat.findOne({ userId, scanId }).lean();
  return chat ? chat.messages : [];
}

module.exports = { askQuestion, getChat };
