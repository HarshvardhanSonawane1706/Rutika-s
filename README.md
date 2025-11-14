# Rutika's Bakery

A full-stack web application for a bakery business, featuring user authentication, menu management, order processing, and an admin panel.

## Features

- User registration and authentication
- Menu browsing and filtering
- Order placement and management
- Admin panel for managing products and orders
- Responsive design

## Tech Stack

- **Backend**: Node.js, Express.js, MongoDB, JWT authentication
- **Frontend**: HTML, CSS, JavaScript
- **Database**: MongoDB Atlas

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account
- Git

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd rutikas-bakery
   ```

2. Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the backend directory with:
   ```
   MONGODB_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_jwt_secret_key
   PORT=3000
   ```

4. Start the backend server:
   ```bash
   npm start
   ```

5. Open `frontend/index.html` in your browser to view the application.

## Deployment Guide

### Free Hosting Setup (Render + Vercel)

This guide shows how to host your bakery website for free using Render (backend) and Vercel (frontend).

#### 1. Database Setup (MongoDB Atlas)

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas) and create a free account
2. Create a new cluster (free tier)
3. Set up database access:
   - Go to Database Access → Add New Database User
   - Create a user with read/write permissions
4. Configure network access:
   - Go to Network Access → Add IP Address
   - Add `0.0.0.0/0` to allow all IPs (for development)
5. Get your connection string:
   - Go to Clusters → Connect → Connect your application
   - Copy the connection string and replace `<password>` with your database user password

#### 2. Backend Deployment (Render)

1. Create a [Render](https://render.com) account
2. Connect your GitHub repository:
   - Click "New +" → "Web Service"
   - Connect your GitHub account and select your repository
3. Configure the service:
   - **Name**: `rutikas-bakery-backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
4. Set environment variables:
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: A secure random string (generate one)
   - `PORT`: `10000` (Render assigns this automatically, but you can set it)
5. Deploy the service
6. Note your backend URL (e.g., `https://rutikas-bakery-backend.onrender.com`)

#### 3. Frontend Deployment (Vercel)

1. Create a [Vercel](https://vercel.com) account
2. Connect your GitHub repository:
   - Click "New Project"
   - Import your GitHub repository
3. Configure the project:
   - **Framework Preset**: `Other`
   - **Root Directory**: `frontend`
   - **Build Settings**: Leave as default (no build needed for static HTML)
4. Deploy the project
5. Your frontend will be available at a Vercel URL (e.g., `https://rutikas-bakery.vercel.app`)

#### 4. Update Frontend API Calls

Before deploying the frontend, update the API base URL in `frontend/script.js`:

```javascript
const API_BASE_URL = process.env.NODE_ENV === 'production'
    ? 'https://your-render-backend-url.onrender.com/api'  // Replace with your actual Render backend URL
    : 'http://localhost:3000/api';
```

Replace `'https://your-render-backend-url.onrender.com/api'` with your actual Render backend URL.

#### 5. CORS Configuration

Your backend already has CORS configured to allow all origins for development. For production, you may want to restrict this to your Vercel domain.

#### Free Tier Limits

- **Render**: 750 hours/month free, sleeps after 15 minutes of inactivity
- **Vercel**: 100GB bandwidth/month free
- **MongoDB Atlas**: 512MB storage free

#### Troubleshooting

- **Backend not starting**: Check Render logs for errors
- **API calls failing**: Verify the API_BASE_URL in script.js matches your Render URL
- **Database connection**: Ensure MongoDB Atlas IP whitelist includes `0.0.0.0/0`
- **CORS errors**: Check that your backend allows requests from your Vercel domain

## API Documentation

### Authentication Endpoints

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/admin-login` - Admin login

### Menu Endpoints

- `GET /api/menu` - Get all menu items
- `POST /api/menu` - Add new menu item (admin)
- `PUT /api/menu/:id` - Update menu item (admin)
- `DELETE /api/menu/:id` - Delete menu item (admin)

### Order Endpoints

- `POST /api/orders` - Place new order
- `GET /api/orders/user/:userId` - Get user orders
- `GET /api/orders` - Get all orders (admin)
- `PUT /api/orders/:id` - Update order status (admin)

### User Endpoints

- `GET /api/users` - Get all users (admin)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
