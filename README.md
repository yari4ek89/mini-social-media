# ✉ Mini Social Media

Fullstack pet project - simple social media, where users can register, login, publish posts, like posts, comment posts,
comment posts, change avatar.

## 🌐 Demo

https://mini-social-media-epj0.onrender.com/

## 🔧 Stack

- **Frontend:** React, React Router, React Context, React Toastify
- **Backend:** Node.js, Express
- **DB:** MongoDB Atlas
- **Auth:** JWT + bcrypt
- **Other:** Cloudinary, Multer, Redis

## ⚙ Functionality

- User registration and authorization
- Changing profile picture
- Creating, liking, commenting posts
- Editing, deleting comments
- Rate limit for creating, liking and commenting posts
- Custom validation (non framework) for profile picture, text fields
- Toast notifier on frontend
- Posts pagination
- Error handler
- Logging out from an account

## ❓ How to start locally?

### 1. Clone repository

```bash
git clone https://github.com/yari4ek89/mini-social-media
cd mini-social-media
```

### 2. Run server

```bash
cd server
npm install
npm run dev
```

### 3. Run client

```bash
cd client
npm install
npm start
```

## 🔨 Environment variables

### Create a .env file in a server folder:

```.dotenv
URI=your_mongodb_connection_string
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
JWT_SECRET=your_jwt_secret
VITE_API_URL=your_vite_url
REDIS_URL=your_redis_url
REDIS_TOKEN=your_redis_token
```

## 📂 Project structure

```text
mini-social-media/
    client/
        src/
            assets/
            components/
            context/
            services/
            utils/
   server/
        src/
            controllers/
            lib/
            middlewares/
            models/
            routes/
            utils/
            .env
   README.md 
```

## 📲Main API endpoints

```http request
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
GET /api/auth/me
GET /api/auth/check-username
GET /api/auth/get-users
POST /api/post/create-post
POST /api/post/like-post
POST /api/post/get-like
POST /api/post/comment-post
GET /api/post/get-post
GET /api/post/get-comments
PUT /api/post/update-comment
DELETE /api/post/delete-comment
POST /api/users/me/avatar
DELETE /api/users/me/avatar
```

## 🧾 TODO

- Finish posts pagination
- Make comments pagination
- Make editing, deleting posts
- Make profile page
- Make settings
- Make searching

## 🕵️‍♂️ Author

- Yaroslav Zhyman
- GitHub: https://github.com/yari4ek89