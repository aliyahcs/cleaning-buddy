# Cleaning Buddy API Server

A simple Express.js API server for the Cleaning Buddy application that connects to Supabase.

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the `api/` directory based on `.env.example`:
```bash
cp .env.example .env
```

3. Fill in your Supabase credentials in the `.env` file:
```
PORT=3000
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
NODE_ENV=development
```

## Running the Server

Start the server:
```bash
npm start
```

The server will run on `http://localhost:3000`

## Required Environment Variables

- `PORT`: Port number for the server (default: 3000)
- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key (from Supabase dashboard)
- `NODE_ENV`: Environment (development or production)

## API Endpoints

### GET /api/rooms
Returns all rooms from the database.

**Example:**
```bash
curl http://localhost:3000/api/rooms
```

**Response:**
```json
{
  "rooms": [
    {
      "id": 1,
      "name": "Kitchen",
      "icon": "🍳",
      "created_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### GET /api/task-templates/:roomId
Returns all tasks for a specific room.

**Example:**
```bash
curl http://localhost:3000/api/task-templates/1
```

**Response:**
```json
{
  "tasks": [
    {
      "id": 1,
      "room_id": 1,
      "name": "Wipe down counters",
      "created_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### GET /api/cleaning-tips
Returns all cleaning tips.

**Example:**
```bash
curl http://localhost:3000/api/cleaning-tips
```

**Response:**
```json
{
  "tips": [
    {
      "id": 1,
      "title": "Clean from top to bottom",
      "content": "Start cleaning from the highest point and work your way down...",
      "category": "general",
      "created_at": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### GET /api/users/:userId
Returns a user profile with their neat freak score and category.

**Example:**
```bash
curl http://localhost:3000/api/users/user-123
```

**Response:**
```json
{
  "user": {
    "id": "user-123",
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "neat_freak_score": 85,
    "neat_freak_category": "Neat Freak",
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

### POST /api/quiz-responses
Saves a user's quiz response to the database.

**Request Body:**
```json
{
  "user_id": "user-123",
  "question_id": 1,
  "answer_value": 75
}
```

**Example:**
```bash
curl -X POST http://localhost:3000/api/quiz-responses \
  -H "Content-Type: application/json" \
  -d '{"user_id":"user-123","question_id":1,"answer_value":75}'
```

**Response:**
```json
{
  "quizResponse": {
    "id": 1,
    "user_id": "user-123",
    "question_id": 1,
    "answer_value": 75,
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

## Error Responses

All endpoints return proper HTTP status codes:
- `200` - Success
- `201` - Created (for POST requests)
- `400` - Bad Request (invalid input)
- `404` - Not Found (resource doesn't exist)
- `500` - Internal Server Error

Error response format:
```json
{
  "error": "Error message description"
}
```

## CORS Configuration

The server is configured to allow CORS requests from the React client at `http://localhost:5173`.
