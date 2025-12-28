# Travel Itinerary Planner with AI Recommendations

A complete MERN-stack application that generates personalized travel itineraries using Google Gemini AI, with interactive maps and PDF export functionality.

## Tech Stack

- **Frontend**: React.js (Vite), Tailwind CSS, Leaflet.js, Axios, React Router
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **AI**: Google Gemini API
- **PDF Export**: PDFKit

## Features

- ✈️ AI-powered itinerary generation based on destination, dates, and preferences
- 🗺️ Interactive map view showing attractions and activities
- 📄 PDF export functionality for offline access
- 💾 Persistent storage of itineraries in MongoDB
- 🎨 Modern, responsive UI with Tailwind CSS
- ⚡ Fast development with Vite

## Project Structure

```
.
├── backend/
│   ├── controllers/
│   │   └── itineraryController.js
│   ├── models/
│   │   ├── User.js
│   │   └── Itinerary.js
│   ├── routes/
│   │   └── itineraryRoutes.js
│   ├── services/
│   │   ├── geminiService.js
│   │   └── pdfService.js
│   ├── server.js
│   ├── package.json
│   └── .env
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Itinerary.jsx
│   │   │   └── MapView.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## Prerequisites

- Node.js (v16 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- Google Gemini API key ([Get it here](https://makersuite.google.com/app/apikey))

## Setup Instructions

### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file (copy from .env.example)
# Windows: copy .env.example .env
# Linux/Mac: cp .env.example .env

# Edit .env file with your configuration:
# PORT=5000
# MONGODB_URI=mongodb://localhost:27017/travel-itinerary
# GEMINI_API_KEY=your_gemini_api_key_here
# FRONTEND_URL=http://localhost:5173

# Start MongoDB (if running locally)
# Make sure MongoDB is running on your system

# Start the backend server
npm start

# For development with auto-reload
npm run dev
```

### 2. Frontend Setup

```bash
# Navigate to frontend directory (in a new terminal)
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend will be available at `http://localhost:5173`

### 3. MongoDB Setup

#### Option A: Local MongoDB

1. Install MongoDB on your system
2. Start MongoDB service
3. Use connection string: `mongodb://localhost:27017/travel-itinerary`

#### Option B: MongoDB Atlas (Cloud)

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Get your connection string
4. Update `MONGODB_URI` in backend `.env` file

## API Endpoints

### POST `/api/itinerary/generate`
Generate a new travel itinerary.

**Request Body:**
```json
{
  "destination": "Paris, France",
  "startDate": "2024-06-01",
  "endDate": "2024-06-05",
  "preferences": {
    "budget": "Moderate",
    "interests": ["Museums", "Food", "History"],
    "travelPace": "moderate"
  },
  "userId": "optional_user_id"
}
```

### GET `/api/itinerary/:id`
Get a specific itinerary by ID.

### GET `/api/itinerary/user/:userId`
Get all itineraries for a user.

### POST `/api/itinerary/export-pdf`
Export itinerary as PDF.

**Request Body:**
```json
{
  "itineraryId": "itinerary_id_here"
}
```

## Usage

1. **Generate Itinerary**:
   - Enter destination, travel dates, and preferences
   - Click "Generate Itinerary"
   - Wait for AI to generate your personalized itinerary

2. **View Itinerary**:
   - Browse day-wise activities
   - See detailed descriptions and timings

3. **Map View**:
   - Click "View Map" to see activities on an interactive map
   - Note: Location coordinates require geocoding service integration

4. **Export PDF**:
   - Click "Export PDF" to download your itinerary
   - Perfect for offline access during travel

## Environment Variables

### Backend (.env)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/travel-itinerary
GEMINI_API_KEY=your_gemini_api_key_here
FRONTEND_URL=http://localhost:5173
```

### Frontend
Create `frontend/.env` if you need to customize API URL:
```
VITE_API_URL=http://localhost:5000/api
```

## Development

### Backend
- Uses ES6 modules
- Auto-reload with `npm run dev`
- MongoDB connection with Mongoose
- Error handling middleware

### Frontend
- Vite for fast development
- React Router for navigation
- Tailwind CSS for styling
- Axios for API calls

## Production Build

### Frontend
```bash
cd frontend
npm run build
```
Output will be in `frontend/dist/`

### Backend
```bash
cd backend
npm start
```

