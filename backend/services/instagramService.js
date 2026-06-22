const axios = require('axios');

class InstagramService {
  constructor(accessToken) {
    this.accessToken = accessToken;
    this.baseUrl = 'https://graph.instagram.com/v18.0';
  }

  async uploadVideo(businessAccountId, videoUrl, caption) {
    try {
      // Create container first
      const containerResponse = await axios.post(
        `${this.baseUrl}/${businessAccountId}/media`,
        {
          media_type: 'VIDEO',
          video_url: videoUrl,
          caption: caption,
          access_token: this.accessToken
        }
      );

      const containerId = containerResponse.data.id;

      // Then publish
      const publishResponse = await axios.post(
        `${this.baseUrl}/${businessAccountId}/media_publish`,
        {
          creation_id: containerId,
          access_token: this.accessToken
        }
      );

      return publishResponse.data;
    } catch (error) {
      console.error('Instagram API Error:', error.response?.data || error.message);
      throw new Error('Failed to upload video to Instagram');
    }
  }

  async getBusinessAccountInfo(businessAccountId) {
    try {
      const response = await axios.get(
        `${this.baseUrl}/${businessAccountId}`,
        {
          params: {
            fields: 'id,name,profile_picture_url',
            access_token: this.accessToken
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error('Instagram API Error:', error.response?.data || error.message);
      throw new Error('Failed to fetch account info');
    }
  }
}

module.exports = InstagramService;
