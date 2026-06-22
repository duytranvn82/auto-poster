# Auto-Poster: YouTube to Social Media

Auto-posting app that distributes content from YouTube to all social media networks (Facebook, TikTok, Instagram, Twitter, LinkedIn).

## Features

✅ Pull videos from YouTube automatically  
✅ Post to multiple platforms simultaneously  
✅ Schedule posts for optimal times  
✅ Custom captions per platform  
✅ Track posting status and analytics  
✅ Dashboard UI for easy management  
✅ Automatic video download and conversion  

## Project Structure

```
auto-poster/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── routes/
│   ├── models/
│   ├── services/
│   ├── middleware/
│   ├── .env
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── App.js
│   │   ├── App.css
│   │   └── index.js
│   ├── public/
│   ├── package.json
│   └── .env
└── README.md
```

## Installation

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your API keys
npm start
```

### Frontend Setup

```bash
cd frontend
npm install
# Create .env file with React app variables
npm start
```

## Environment Variables

### Backend (.env)

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/autoposter
REDIS_HOST=localhost
REDIS_PORT=6379

YOUTUBE_API_KEY=your_youtube_api_key
FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_APP_SECRET=your_facebook_app_secret
TIKTOK_CLIENT_ID=your_tiktok_client_id
TIKTOK_CLIENT_SECRET=your_tiktok_client_secret
INSTAGRAM_BUSINESS_ACCOUNT_ID=your_instagram_business_id
TWITTER_API_KEY=your_twitter_api_key
TWITTER_API_SECRET=your_twitter_api_secret
LINKEDIN_CLIENT_ID=your_linkedin_client_id
LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret
```

## API Endpoints

### YouTube
- `GET /api/youtube/videos/:channelId` - Get user's videos
- `GET /api/youtube/video/:videoId` - Get video details

### Posts
- `POST /api/posts/create` - Create post from YouTube video
- `PUT /api/posts/update/:postId` - Update post captions
- `GET /api/posts/user/:userId` - Get user's posts

### Scheduling
- `POST /api/schedule/schedule` - Schedule a post
- `GET /api/schedule/scheduled/:userId` - Get scheduled posts

## Technologies Used

**Backend:**
- Node.js + Express
- MongoDB + Mongoose
- Redis + Bull (job queue)
- YouTube Data API v3
- Facebook Graph API
- TikTok API
- Instagram Graph API
- Twitter API v2
- LinkedIn API

**Frontend:**
- React.js
- Axios
- CSS3

## Getting API Keys

### YouTube
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create new project
3. Enable YouTube Data API v3
4. Create OAuth 2.0 credentials

### Facebook
1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create app
3. Add Facebook Login product
4. Get Access Token

### TikTok
1. Go to [TikTok Developer](https://developer.tiktok.com/)
2. Create app
3. Request Business Account access
4. Get Client ID and Secret

### Instagram
1. Use Facebook App
2. Get Business Account ID
3. Generate Access Token

### Twitter
1. Go to [Twitter Developer Portal](https://developer.twitter.com/)
2. Create app
3. Generate API keys

### LinkedIn
1. Go to [LinkedIn Developers](https://www.linkedin.com/developers/)
2. Create app
3. Get Client ID and Secret

## Running the App

```bash
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend
cd frontend
npm start

# Terminal 3 - Redis (if not running)
redis-server

# Terminal 4 - MongoDB (if not running)
mongod
```

Access the app at `http://localhost:3000`

## Workflow

1. Connect your YouTube channel
2. Connect your social media accounts
3. Select a YouTube video
4. Choose which platforms to post to
5. Customize captions per platform
6. Schedule posting time
7. App automatically posts at scheduled time
8. Track analytics and engagement

## License

MIT

## Support

For issues and questions, please open a GitHub issue.
