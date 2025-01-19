const app = require('./app');
const connectDB = require('./config/db');
require('dotenv').config();

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB()
  .then(() => {
    // Start the server only after successful connection to MongoDB
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error(`Failed to start the server: ${error.message}`);
  });
