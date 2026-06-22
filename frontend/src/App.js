import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(localStorage.getItem('userId') || '');
  const [channelId, setChannelId] = useState(localStorage.getItem('channelId') || '');
  const [platforms, setPlatforms] = useState({
    facebook: false,
    tiktok: false,
    instagram: false,
    twitter: false,
    linkedin: false
  });
  const [scheduledTime, setScheduledTime] = useState('');
  const [captions, setCaptions] = useState({
    facebook: '',
    tiktok: '',
    instagram: '',
    twitter: '',
    linkedin: ''
  });

  const fetchYouTubeVideos = async () => {
    if (!channelId) {
      alert('Please enter your YouTube Channel ID');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(`/api/youtube/videos/${channelId}`);
      setVideos(response.data.data || []);
    } catch (error) {
      console.error('Error fetching videos:', error);
      alert('Error fetching videos: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  const createPost = async (videoId) => {
    if (!userId) {
      alert('Please enter your User ID');
      return;
    }

    const selectedPlatforms = Object.keys(platforms).filter(p => platforms[p]);
    if (selectedPlatforms.length === 0) {
      alert('Please select at least one platform');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post('/api/posts/create', {
        userId,
        videoId,
        platforms: selectedPlatforms
      });
      setSelectedVideo(response.data.data);
      alert('Post created successfully!');
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Error creating post: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  const schedulePost = async () => {
    if (!selectedVideo) {
      alert('Please create a post first');
      return;
    }

    if (!scheduledTime) {
      alert('Please select a scheduled time');
      return;
    }

    const selectedPlatforms = Object.keys(platforms).filter(p => platforms[p]);

    try {
      setLoading(true);
      await axios.post('/api/schedule/schedule', {
        postId: selectedVideo._id,
        userId,
        scheduledTime: new Date(scheduledTime).toISOString(),
        platforms: selectedPlatforms
      });
      alert('Post scheduled successfully!');
      setSelectedVideo(null);
      setScheduledTime('');
      setCaptions({
        facebook: '',
        tiktok: '',
        instagram: '',
        twitter: '',
        linkedin: ''
      });
    } catch (error) {
      console.error('Error scheduling post:', error);
      alert('Error scheduling post: ' + (error.response?.data?.error || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleSaveChannelId = () => {
    localStorage.setItem('channelId', channelId);
    localStorage.setItem('userId', userId);
    alert('Settings saved!');
  };

  return (
    <div className="App">
      <header className="header">
        <h1>🚀 Auto-Poster Dashboard</h1>
        <p>Distribute your YouTube videos to all social media platforms</p>
      </header>

      <div className="container">
        <section className="setup-section">
          <h2>📋 Setup</h2>
          <div className="input-group">
            <input
              type="text"
              placeholder="Enter your User ID"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
            />
            <input
              type="text"
              placeholder="Enter your YouTube Channel ID"
              value={channelId}
              onChange={(e) => setChannelId(e.target.value)}
            />
            <button onClick={handleSaveChannelId} className="btn btn-primary">
              Save Settings
            </button>
          </div>
        </section>

        <section className="platforms-section">
          <h2>🌐 Select Platforms</h2>
          <div className="platform-grid">
            {Object.keys(platforms).map(platform => (
              <label key={platform} className="platform-checkbox">
                <input
                  type="checkbox"
                  checked={platforms[platform]}
                  onChange={(e) => setPlatforms({ ...platforms, [platform]: e.target.checked })}
                />
                <span>{platform.charAt(0).toUpperCase() + platform.slice(1)}</span>
              </label>
            ))}
          </div>
        </section>

        <section className="videos-section">
          <h2>📺 Your YouTube Videos</h2>
          <button
            onClick={fetchYouTubeVideos}
            disabled={loading}
            className="btn btn-primary"
          >
            {loading ? 'Loading...' : 'Fetch Videos'}
          </button>

          {videos.length > 0 && (
            <div className="video-grid">
              {videos.map(video => (
                <div key={video.id.videoId} className="video-card">
                  <img
                    src={video.snippet.thumbnails.medium.url}
                    alt={video.snippet.title}
                  />
                  <h3>{video.snippet.title}</h3>
                  <p>{video.snippet.description.substring(0, 100)}...</p>
                  <button
                    onClick={() => createPost(video.id.videoId)}
                    disabled={loading}
                    className="btn btn-secondary"
                  >
                    {loading ? 'Creating...' : 'Create Post'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        {selectedVideo && (
          <section className="post-details-section">
            <h2>✏️ Post Details</h2>
            <div className="post-info">
              <h3>{selectedVideo.youtubeTitle}</h3>
              <p>{selectedVideo.youtubeDescription}</p>

              <div className="captions-section">
                <h3>📝 Custom Captions</h3>
                {Object.keys(captions).map(platform => {
                  if (!platforms[platform]) return null;
                  return (
                    <div key={platform} className="caption-input">
                      <label>{platform.charAt(0).toUpperCase() + platform.slice(1)}:</label>
                      <textarea
                        value={captions[platform]}
                        onChange={(e) => setCaptions({ ...captions, [platform]: e.target.value })}
                        placeholder={`Custom caption for ${platform}`}
                        rows="3"
                      />
                    </div>
                  );
                })}
              </div>

              <div className="schedule-section">
                <h3>⏰ Schedule Post</h3>
                <input
                  type="datetime-local"
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                />
                <button
                  onClick={schedulePost}
                  disabled={loading}
                  className="btn btn-success"
                >
                  {loading ? 'Scheduling...' : 'Schedule Post'}
                </button>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

export default App;
