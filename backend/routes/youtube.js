const express = require('express');
const YouTubeService = require('../services/youtubeService');
const router = express.Router();

const youtubeService = new YouTubeService(process.env.YOUTUBE_API_KEY);

// Get user's videos
router.get('/videos/:channelId', async (req, res) => {
  try {
    const videos = await youtubeService.getUserVideos(req.params.channelId);
    res.json({
      success: true,
      data: videos
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get video details
router.get('/video/:videoId', async (req, res) => {
  try {
    const details = await youtubeService.getVideoDetails(req.params.videoId);
    res.json({
      success: true,
      data: details
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get channel info
router.get('/channel/:channelId', async (req, res) => {
  try {
    const info = await youtubeService.getChannelInfo(req.params.channelId);
    res.json({
      success: true,
      data: info
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
