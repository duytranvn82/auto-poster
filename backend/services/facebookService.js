const axios = require('axios');
const fs = require('fs');

class FacebookService {
  constructor(accessToken) {
    this.accessToken = accessToken;
    this.baseUrl = 'https://graph.facebook.com/v18.0';
  }

  async postVideo(pageId, videoPath, caption) {
    try {
      const FormData = require('form-data');
      const form = new FormData();
      form.append('source', fs.createReadStream(videoPath));
      form.append('caption', caption);
      form.append('access_token', this.accessToken);

      const response = await axios.post(
        `${this.baseUrl}/${pageId}/videos`,
        form,
        { headers: form.getHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error('Facebook API Error:', error.response?.data || error.message);
      throw new Error('Failed to post video to Facebook');
    }
  }

  async postLink(pageId, link, caption) {
    try {
      const response = await axios.post(
        `${this.baseUrl}/${pageId}/feed`,
        {
          link: link,
          message: caption,
          access_token: this.accessToken
        }
      );
      return response.data;
    } catch (error) {
      console.error('Facebook API Error:', error.response?.data || error.message);
      throw new Error('Failed to post link to Facebook');
    }
  }

  async getPageInfo(pageId) {
    try {
      const response = await axios.get(
        `${this.baseUrl}/${pageId}`,
        {
          params: {
            fields: 'id,name,picture',
            access_token: this.accessToken
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Facebook API Error:', error.response?.data || error.message);
      throw new Error('Failed to fetch page info');
    }
  }
}

module.exports = FacebookService;
