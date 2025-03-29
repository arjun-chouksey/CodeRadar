const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cron = require('node-cron');

// Import routes
const contestRoutes = require('./routes/contests');

// Import services
const { fetchAndUpdateContests } = require('./services/contestService');

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));

// Routes
app.use('/api/contests', contestRoutes);

// Health check route
app.get('/', (req, res) => {
  res.send('CodeRadar API is running');
});

// Schedule tasks to fetch contests every 3 hours
cron.schedule('0 */3 * * *', async () => {
  console.log('Running scheduled task to fetch contests');
  await fetchAndUpdateContests();
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  
  // Fetch contests when server starts
  fetchAndUpdateContests();
});
