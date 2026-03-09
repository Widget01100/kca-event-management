const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const eventRoutes = require('./routes/eventRoutes');
const { db } = require('./services/firebaseService'); // Import Firebase db

const app = express();

// Middleware
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);

// Temporary route to test Firebase connection
app.get('/test-db', async (req, res) => {
  try {
    // Attempt to write a test document to Firestore
    await db.collection('test').doc('connection').set({ test: true });
    res.send('Database connection successful!');
  } catch (error) {
    res.status(500).send(`DB Error: ${error.message}`);
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
// Add to backend/index.js
app.get('/test-routes', (req, res) => {
  res.send('Routes are working!');
});
