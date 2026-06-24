const errorResponse = (
  res,
  status,
  type,
  message
) => {
  return res.status(status).json({
    success: false,
    type,
    message,
  });
};

module.exports = errorResponse;