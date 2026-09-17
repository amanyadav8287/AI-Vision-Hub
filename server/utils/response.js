/**
 * Build a consistent success response envelope.
 */
function success(res, { data = null, message = "Success", statusCode = 200, meta = null } = {}) {
  const payload = { success: true, message, data };
  if (meta) payload.meta = meta;
  return res.status(statusCode).json(payload);
}

/**
 * Build a consistent error response envelope.
 */
function error(res, { message = "Server error", statusCode = 500, errors = null } = {}) {
  const payload = { success: false, message };
  if (errors) payload.errors = errors;
  return res.status(statusCode).json(payload);
}

module.exports = { success, error };
