const express = require('express');
const app = express();

//parse JSON
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Hello, World!' });
});

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
