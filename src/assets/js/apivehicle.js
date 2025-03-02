// Import Express
const express = require('express');
const app = express();

// Middleware to parse JSON bodies in requests
app.use(express.json());

// Root endpoint that returns a simple message
app.get('/', (req, res) => {
  res.json({ message: 'Hello, World!' });
});

// Example endpoint with a path parameter and an optional query parameter
app.get('/items/:id', (req, res) => {
  const itemId = req.params.id;
  const query = req.query.q;
  res.json({ itemId, query });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
