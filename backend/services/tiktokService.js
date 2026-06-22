const axios = require('axios');

class TikTokService {
  constructor(accessToken) {
    this.accessToken = accessToken;
    this.baseUrl = 'https://open.tiktok.com/v1';
  }

  async uploadVideo(videoPath, caption, hashtags = []) {
    try {
      const FormData = require('form-data');
      const fs = require('fs');
      const form = new FormData();
      
      form.append('video', fs.createReadStream(videoPath));
      form.append('description', caption);
      form.append('access_token', this.accessToken);

      const response = await axios.post(
        `${this.baseUrl}/video/upload`,
        form,
        { headers: form.getHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error('TikTok API Error:', error.response?.data || error.message);
      throw new Error('Failed to upload video to TikTok');
    }
  }

  async getUserInfo(username) {
    try {
      const response = await axios.get(
        `${this.baseUrl}/user/search`,
        {
          params: {
            username: username,
            access_token: this.accessToken
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('TikTok API Error:', error.response?.data || error.message);
      throw new Error('Failed to fetch user info');
    }
  }
}

module.exports = TikTokService;
