const axios = require('axios');

class YouTubeService {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseUrl = 'https://www.googleapis.com/youtube/v3';
  }

  async getUserVideos(channelId, maxResults = 50) {
    try {
      const response = await axios.get(`${this.baseUrl}/search`, {
        params: {
          channelId: channelId,
          part: 'snippet',
          order: 'date',
          maxResults: maxResults,
          key: this.apiKey,
          type: 'video'
        }
      });
      return response.data.items;
    } catch (error) {
      console.error('YouTube API Error:', error.response?.data || error.message);
      throw new Error('Failed to fetch YouTube videos');
    }
  }

  async getVideoDetails(videoId) {
    try {
      const response = await axios.get(`${this.baseUrl}/videos`, {
        params: {
          id: videoId,
          part: 'snippet,statistics,contentDetails',
          key: this.apiKey
        }
      });
      return response.data.items[0];
    } catch (error) {
      console.error('YouTube API Error:', error.response?.data || error.message);
      throw new Error('Failed to fetch video details');
    }
  }

  async getChannelInfo(channelId) {
    try {
      const response = await axios.get(`${this.baseUrl}/channels`, {
        params: {
          id: channelId,
          part: 'snippet,statistics,contentDetails',
          key: this.apiKey
        }
      });
      return response.data.items[0];
    } catch (error) {
      console.error('YouTube API Error:', error.response?.data || error.message);
      throw new Error('Failed to fetch channel info');
    }
  }
}

module.exports = YouTubeService;
