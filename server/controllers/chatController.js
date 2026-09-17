const chatService = require("../services/chatService");
const { success } = require("../utils/response");

/**
 * POST /api/chat
 * Body: { scanId, message }
 */
async function ask(req, res, next) {
  try {
    const { reply, timestamp } = await chatService.askQuestion({
      userId: req.user._id,
      scanId: req.body.scanId,
      message: req.body.message,
    });
    return success(res, {
      message: "Reply generated",
      data: { reply, timestamp },
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/chat/:scanId
 */
async function history(req, res, next) {
  try {
    const messages = await chatService.getChat({
      userId: req.user._id,
      scanId: req.params.scanId,
    });
    return success(res, { data: messages });
  } catch (err) {
    next(err);
  }
}

module.exports = { ask, history };
