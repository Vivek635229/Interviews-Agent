// ═══════════════════════════════════════════════════════════════
// Async Error Wrapper — Eliminates try/catch in controllers
// ═══════════════════════════════════════════════════════════════

const catchAsync = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

module.exports = catchAsync;
