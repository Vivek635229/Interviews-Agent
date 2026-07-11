// ═══════════════════════════════════════════════════════════════
// Logger — Structured logging for dev and production
// ═══════════════════════════════════════════════════════════════

const env = require('../config/env');

const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m',
};

const timestamp = () => new Date().toISOString();

const logger = {
  info: (message, ...args) => {
    console.log(`${colors.gray}${timestamp()}${colors.reset} ${colors.green}[INFO]${colors.reset}  ${message}`, ...args);
  },

  warn: (message, ...args) => {
    console.warn(`${colors.gray}${timestamp()}${colors.reset} ${colors.yellow}[WARN]${colors.reset}  ${message}`, ...args);
  },

  error: (message, ...args) => {
    console.error(`${colors.gray}${timestamp()}${colors.reset} ${colors.red}[ERROR]${colors.reset} ${message}`, ...args);
  },

  debug: (message, ...args) => {
    if (env.isDev) {
      console.log(`${colors.gray}${timestamp()}${colors.reset} ${colors.cyan}[DEBUG]${colors.reset} ${message}`, ...args);
    }
  },

  request: (method, url, status, duration) => {
    const color = status >= 500 ? colors.red : status >= 400 ? colors.yellow : colors.green;
    console.log(
      `${colors.gray}${timestamp()}${colors.reset} ${colors.blue}[HTTP]${colors.reset}  ${method} ${url} ${color}${status}${colors.reset} ${colors.gray}${duration}ms${colors.reset}`
    );
  },
};

module.exports = logger;
