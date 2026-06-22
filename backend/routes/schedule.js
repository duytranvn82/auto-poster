const express = require('express');
const postQueue = require('../services/scheduler');
const Post = require('../models/Post');
const router = express.Router();

// Schedule a post
router.post('/schedule', async (req, res) => {
  try {
    const { postId, userId, scheduledTime, platforms } = req.body;

    if (!postId || !userId || !scheduledTime) {
      return res.status(400).json({
        success: false,
        error: 'postId, userId, and scheduledTime are required'
      });
    }

    // Update post
    const post = await Post.findByIdAndUpdate(
      postId,
      {
        scheduledTime,
        status: 'scheduled'
      },
      { new: true }
    );

    // Add to queue with delay
    const delay = new Date(scheduledTime) - new Date();
    if (delay > 0) {
      await postQueue.add(
        { postId, userId, platforms: platforms || ['facebook', 'tiktok', 'instagram'] },
        { delay: Math.max(0, delay) }
      );
    } else {
      // Schedule in past - post immediately
      await postQueue.add(
        { postId, userId, platforms: platforms || ['facebook', 'tiktok', 'instagram'] }
      );
    }

    res.json({
      success: true,
      message: 'Post scheduled successfully',
      data: post
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get scheduled posts
router.get('/scheduled/:userId', async (req, res) => {
  try {
    const posts = await Post.find({
      userId: req.params.userId,
      status: 'scheduled'
    }).sort({ scheduledTime: 1 });
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

// Get posted posts
router.get('/posted/:userId', async (req, res) => {
  try {
    const posts = await Post.find({
      userId: req.params.userId,
      status: 'posted'
    }).sort({ postedTime: -1 });
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

// Cancel scheduled post
router.post('/cancel/:postId', async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.params.postId,
      { status: 'draft' },
      { new: true }
    );
    res.json({
      success: true,
      message: 'Post cancelled',
      data: post
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
