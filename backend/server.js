require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require('./config/db');
const contestRoutes = require('./routes/contestRoutes');
const { updateContestStatuses } = require('./utils/helpers');
const Contest = require('./models/Contest');

// Connect to MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/contests', contestRoutes);

app.get("/", (req, res) => {
    res.send("CodeRadar Backend is running!");
});

// Set up scheduled tasks
const updateInterval = 30 * 60 * 1000; // 30 minutes
setInterval(async () => {
  try {
    // Update contest statuses
    await updateContestStatuses(Contest);
  } catch (error) {
    console.error('Error in scheduled task:', error);
  }
}, updateInterval);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
