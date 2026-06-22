const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  youtubeVideoId: String,
  youtubeTitle: String,
  youtubeDescription: String,
  youtubeUrl: String,
  videoLocalPath: String,
  thumbnailUrl: String,
  videoDuration: Number,
  views: Number,
  likes: Number,
  status: {
    type: String,
    enum: ['draft', 'pending', 'scheduled', 'posted', 'failed'],
    default: 'draft'
  },
  scheduledTime: Date,
  postedTime: Date,
  platforms: {
    facebook: {
      posted: { type: Boolean, default: false },
      postId: String,
      customCaption: String,
      error: String
    },
    tiktok: {
      posted: { type: Boolean, default: false },
      postId: String,
      customCaption: String,
      error: String
    },
    instagram: {
      posted: { type: Boolean, default: false },
      postId: String,
      customCaption: String,
      error: String
    },
    twitter: {
      posted: { type: Boolean, default: false },
      postId: String,
      customCaption: String,
      error: String
    },
    linkedin: {
      posted: { type: Boolean, default: false },
      postId: String,
      customCaption: String,
      error: String
    }
  },
  analytics: {
    totalEngagement: { type: Number, default: 0 },
    shares: { type: Number, default: 0 },
    comments: { type: Number, default: 0 }
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Post', postSchema);
