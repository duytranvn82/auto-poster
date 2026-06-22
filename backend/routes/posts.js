const express = require('express');
const Post = require('../models/Post');
const YouTubeService = require('../services/youtubeService');
const router = express.Router();

const youtubeService = new YouTubeService(process.env.YOUTUBE_API_KEY);

// Create post from YouTube video
router.post('/create', async (req, res) => {
  try {
    const { userId, videoId, platforms } = req.body;

    if (!userId || !videoId) {
      return res.status(400).json({
        success: false,
        error: 'userId and videoId are required'
      });
    }

    // Get video details
    const videoDetails = await youtubeService.getVideoDetails(videoId);

    if (!videoDetails) {
      return res.status(404).json({
        success: false,
        error: 'Video not found'
      });
    }

    // Create post
    const post = new Post({
      userId,
      youtubeVideoId: videoId,
      youtubeTitle: videoDetails.snippet.title,
      youtubeDescription: videoDetails.snippet.description,
      youtubeUrl: `https://www.youtube.com/watch?v=${videoId}`,
      thumbnailUrl: videoDetails.snippet.thumbnails.high.url,
      videoDuration: videoDetails.contentDetails.duration,
      views: videoDetails.statistics.viewCount,
      likes: videoDetails.statistics.likeCount,
      platforms: {
        facebook: { posted: false, customCaption: '' },
        tiktok: { posted: false, customCaption: '' },
        instagram: { posted: false, customCaption: '' },
        twitter: { posted: false, customCaption: '' },
        linkedin: { posted: false, customCaption: '' }
      }
    });

    await post.save();
    res.json({
      success: true,
      data: post
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Update post captions
router.put('/update/:postId', async (req, res) => {
  try {
    const { platforms } = req.body;
    const post = await Post.findByIdAndUpdate(
      req.params.postId,
      {
        'platforms.facebook.customCaption': platforms.facebook?.customCaption || '',
        'platforms.tiktok.customCaption': platforms.tiktok?.customCaption || '',
        'platforms.instagram.customCaption': platforms.instagram?.customCaption || '',
        'platforms.twitter.customCaption': platforms.twitter?.customCaption || '',
        'platforms.linkedin.customCaption': platforms.linkedin?.customCaption || ''
      },
      { new: true }
    );
    res.json({
      success: true,
      data: post
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get user posts
router.get('/user/:userId', async (req, res) => {
  try {
    const posts = await Post.find({ userId: req.params.userId })
      .sort({ createdAt: -1 });
    res.json({
      success: true,
      data: posts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get single post
router.get('/:postId', async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        error: 'Post not found'
      });
    }
    res.json({
      success: true,
      data: post
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Delete post
router.delete('/:postId', async (req, res) => {
  try {
    await Post.findByIdAndDelete(req.params.postId);
    res.json({
      success: true,
      message: 'Post deleted'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
