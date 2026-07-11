// ═══════════════════════════════════════════════════════════════
// User Model — Authentication + Profile
// ═══════════════════════════════════════════════════════════════

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: 2,
      maxlength: 50,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 8,
      select: false, // Never return password by default
    },
    role: {
      type: String,
      default: 'user',
      enum: ['user', 'admin'],
    },
    title: {
      type: String,
      trim: true,
      maxlength: 100,
    },
    avatar: {
      type: String,
      default: '',
    },
    refreshToken: {
      type: String,
      select: false,
    },
    preferences: {
      theme: { type: String, default: 'light', enum: ['light', 'dark'] },
      emailNotifications: { type: Boolean, default: true },
      interviewReminders: { type: Boolean, default: true },
      weeklyReports: { type: Boolean, default: false },
      soundEffects: { type: Boolean, default: true },
    },
    stats: {
      totalInterviews: { type: Number, default: 0 },
      avgScore: { type: Number, default: 0 },
      totalPracticeHours: { type: Number, default: 0 },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ── Indexes ──
userSchema.index({ email: 1 });

// ── Pre-save: Hash password ──
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
});

// ── Instance method: Compare password ──
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// ── Instance method: Safe JSON (no password) ──
userSchema.methods.toSafeJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.refreshToken;
  delete obj.__v;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
