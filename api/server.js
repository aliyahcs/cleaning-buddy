const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', // React client URL
  credentials: true
}));
app.use(express.json());

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// ==================== ENDPOINTS ====================

/**
 * GET /api/rooms
 * Returns all rooms from the database
 */
app.get('/api/rooms', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('rooms')
      .select('*')
      .order('room_id');

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: 'Failed to fetch rooms' });
    }

    res.status(200).json({ rooms: data });
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /api/task-templates/:roomId
 * Returns all tasks for a specific room
 */
app.get('/api/task-templates/:roomId', async (req, res) => {
  try {
    const { roomId } = req.params;

    // Validate roomId is a number
    const roomIdNum = parseInt(roomId);
    if (isNaN(roomIdNum)) {
      return res.status(400).json({ error: 'Invalid room ID' });
    }

    const { data, error } = await supabase
      .from('task_templates')
      .select('*')
      .eq('room_id', roomIdNum)
      .order('display_order');

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: 'Failed to fetch tasks' });
    }

    res.status(200).json({ tasks: data });
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /api/cleaning-tips
 * Returns all cleaning tips
 */
app.get('/api/cleaning-tips', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('cleaning_tips')
      .select('*')
      .order('display_order');

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: 'Failed to fetch cleaning tips' });
    }

    res.status(200).json({ tips: data });
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /api/users/:userId
 * Returns a user profile with their neat freak score and category
 */
app.get('/api/users/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    // Validate userId
    if (!userId || typeof userId !== 'string') {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // Row not found
        return res.status(404).json({ error: 'User not found' });
      }
      console.error('Supabase error:', error);
      return res.status(500).json({ error: 'Failed to fetch user' });
    }

    res.status(200).json({ user: data });
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * POST /api/quiz-responses
 * Saves a user's quiz response to the database
 * Request body: { user_id, question_id, option_id, free_text_response }
 */
app.post('/api/quiz-responses', async (req, res) => {
  try {
    const { user_id, question_id, option_id, free_text_response } = req.body;

    // Validate required fields
    if (!user_id || !question_id || option_id === undefined) {
      return res.status(400).json({ 
        error: 'Missing required fields: user_id, question_id, option_id' 
      });
    }

    // Validate option_id is a number
    if (typeof option_id !== 'number') {
      return res.status(400).json({ error: 'option_id must be a number' });
    }

    const { error } = await supabase
      .from('user_quiz_responses')
      .insert([
        {
          user_id,
          question_id,
          option_id,
          free_text_response: free_text_response || null
        }
      ]);

    if (error) {
      console.error('Supabase error:', error);
      
      // Handle duplicate key violation
      if (error.code === '23505') {
        return res.status(409).json({ error: 'Response already exists' });
      }
      
      return res.status(500).json({ error: 'Failed to save quiz response' });
    }

    res.status(201).json({ message: 'Quiz response saved successfully' });
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ==================== ERROR HANDLING ====================

// 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// ==================== START SERVER ====================

app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
  console.log('Available endpoints:');
  console.log('  GET  /api/rooms');
  console.log('  GET  /api/task-templates/:roomId');
  console.log('  GET  /api/cleaning-tips');
  console.log('  GET  /api/users/:userId');
  console.log('  POST /api/quiz-responses');
});
