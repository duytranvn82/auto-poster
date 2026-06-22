const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  name: String,
  youtubeChannelId: String,
  socialAccounts: {
    facebook: {
      token: String,
      pageId: String,
      connected: { type: Boolean, default: false }
    },
    tiktok: {
      token: String,
      username: String,
      connected: { type: Boolean, default: false }
    },
    instagram: {
      token: String,
      businessAccountId: String,
      connected: { type: Boolean, default: false }
    },
    twitter: {
      token: String,
      userId: String,
      connected: { type: Boolean, default: false }
    },
    linkedin: {
      token: String,
      organizationId: String,
      connected: { type: Boolean, default: false }
    }
  },
  settings: {
    autoDownload: { type: Boolean, default: true },
    autoPost: { type: Boolean, default: false },
    defaultPlatforms: [String]
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
