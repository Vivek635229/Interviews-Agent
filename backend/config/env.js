// ═══════════════════════════════════════════════════════════════
// Environment Configuration — Fail-fast validation
// ═══════════════════════════════════════════════════════════════

const dotenv = require('dotenv');
const path = require('path');

// Load .env from backend root
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const requiredVars = [
  'MONGODB_URI',
  'JWT_ACCESS_SECRET',
  'JWT_REFRESH_SECRET',
];

const optionalVars = [
  'IBM_API_KEY',
  'IBM_PROJECT_ID',
  'IBM_AUTH_URL',
  'IBM_WATSONX_URL',
  'IBM_MODEL_ID',
];

// Validate required variables
const missing = requiredVars.filter((key) => !process.env[key]);
if (missing.length > 0 && process.env.NODE_ENV !== 'test') {
  console.error(`❌ Missing required environment variables: ${missing.join(', ')}`);
  console.error('   Copy .env.example to .env and fill in the values.');
  process.exit(1);
}

// Warn about optional IBM vars
const missingOptional = optionalVars.filter((key) => !process.env[key]);
if (missingOptional.length > 0) {
  console.warn(`⚠️  Missing optional IBM variables: ${missingOptional.join(', ')}`);
  console.warn('   IBM watsonx.ai features will use mock responses.');
}

const env = {
  // Server
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.BACKEND_PORT || process.env.PORT, 10) || 5000,

  // MongoDB
  MONGODB_URI: process.env.MONGODB_URI,

  // JWT
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
  JWT_ACCESS_EXPIRY: process.env.JWT_ACCESS_EXPIRY || '15m',
  JWT_REFRESH_EXPIRY: process.env.JWT_REFRESH_EXPIRY || '7d',

  // IBM watsonx.ai
  IBM_API_KEY: process.env.IBM_API_KEY || '',
  IBM_PROJECT_ID: process.env.IBM_PROJECT_ID || '',
  IBM_AUTH_URL: process.env.IBM_AUTH_URL || 'https://iam.cloud.ibm.com/identity/token',
  IBM_WATSONX_URL: process.env.IBM_WATSONX_URL || 'https://us-south.ml.cloud.ibm.com/ml/v1/text/generation?version=2024-05-31',
  IBM_MODEL_ID: process.env.IBM_MODEL_ID || 'ibm/granite-3-8b-instruct',

  // IBM COS (Future)
  IBM_COS_ENDPOINT: process.env.IBM_COS_ENDPOINT || '',
  IBM_COS_API_KEY: process.env.IBM_COS_API_KEY || '',
  IBM_COS_INSTANCE_ID: process.env.IBM_COS_INSTANCE_ID || '',
  IBM_COS_BUCKET: process.env.IBM_COS_BUCKET || '',

  // Frontend
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:3000',

  // Upload
  MAX_FILE_SIZE: parseInt(process.env.MAX_FILE_SIZE, 10) || 5 * 1024 * 1024,
  UPLOAD_PATH: process.env.UPLOAD_PATH || 'backend/uploads',

  // Helpers
  isDev: (process.env.NODE_ENV || 'development') === 'development',
  isProd: process.env.NODE_ENV === 'production',
  hasIBM: !!(process.env.IBM_API_KEY && process.env.IBM_PROJECT_ID),
};

module.exports = env;
