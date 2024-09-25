require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 5002;

// const corsOptions = {
//   origin: 'http://localhost:3000', // Replace with your frontend URL
//   methods: ['GET', 'POST'], // Specify sallowed HTTP methods
// };

// app.use(cors(corsOptions));


// Middleware
app.use(cors());
app.use(express.json());

mongoose.set('strictQuery', false);

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch((err) => console.log('Error connecting to MongoDB:', err));

// API Routes
app.use('/api/auth', authRoutes);

// Serve the React frontend files (important for production)
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
