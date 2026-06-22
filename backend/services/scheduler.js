const Queue = require('bull');
const redis = require('redis');
const Post = require('../models/Post');
const User = require('../models/User');
const FacebookService = require('./facebookService');
const TikTokService = require('./tiktokService');
const InstagramService = require('./instagramService');

const postQueue = new Queue('social-posts', {
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: process.env.REDIS_PORT || 6379
  }
});

postQueue.process(async (job) => {
  const { postId, userId, platforms } = job.data;
  
  try {
    const user = await User.findById(userId);
    const post = await Post.findById(postId);

    if (!user || !post) {
      throw new Error('User or Post not found');
    }

    // Post to each platform
    for (const platform of platforms) {
      try {
        if (platform === 'facebook' && user.socialAccounts.facebook.token) {
          const fbService = new FacebookService(user.socialAccounts.facebook.token);
          const result = await fbService.postLink(
            user.socialAccounts.facebook.pageId,
            post.youtubeUrl,
            post.platforms.facebook.customCaption || post.youtubeDescription
          );
          post.platforms.facebook.posted = true;
          post.platforms.facebook.postId = result.id;
        }

        if (platform === 'tiktok' && user.socialAccounts.tiktok.token) {
          const ttService = new TikTokService(user.socialAccounts.tiktok.token);
          const result = await ttService.uploadVideo(
            post.videoLocalPath,
            post.platforms.tiktok.customCaption || post.youtubeDescription
          );
          post.platforms.tiktok.posted = true;
          post.platforms.tiktok.postId = result.data.video_id;
        }

        if (platform === 'instagram' && user.socialAccounts.instagram.token) {
          const igService = new InstagramService(user.socialAccounts.instagram.token);
          const result = await igService.uploadVideo(
            user.socialAccounts.instagram.businessAccountId,
            post.youtubeUrl,
            post.platforms.instagram.customCaption || post.youtubeDescription
          );
          post.platforms.instagram.posted = true;
          post.platforms.instagram.postId = result.id;
        }
      } catch (error) {
        console.error(`Failed to post to ${platform}:`, error);
        post.platforms[platform].posted = false;
        post.platforms[platform].error = error.message;
      }
    }

    post.status = 'posted';
    post.postedTime = new Date();
    await post.save();
    return { success: true, postId };
  } catch (error) {
    console.error('Job failed:', error);
    throw error;
  }
});

postQueue.on('failed', (job, error) => {
  console.error(`Job ${job.id} failed:`, error);
});

postQueue.on('completed', (job) => {
  console.log(`Job ${job.id} completed successfully`);
});

module.exports = postQueue;
