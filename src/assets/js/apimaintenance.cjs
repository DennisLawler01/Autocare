const express = require('express');
const request = require('request');
const dotenv = require('dotenv');
const cors = require('cors');

// Load environment variables from the "apikey.env" file
dotenv.config({ path: 'apikey.env' });

// Initialize the Express app
const app = express();

// Enable CORS for all routes
app.use(cors());

const API_KEY = process.env.API_KEY;

app.get('/vehicle/:year/:make/:model/:trim?', (req, res) => {
  const { year, make, model, trim } = req.params;
  
  // Construct the API URL; include trim if provided
  let apiUrl = `https://api.vehicledatabases.com/vehicle-maintenance/v2/${year}/${make}/${model}`;
  if (trim) {
    // Encode the trim value so that spaces and special characters are URL safe
    const encodedTrim = encodeURIComponent(trim);
    apiUrl += `/${encodedTrim}`;
  }
  
  // Set up request options
  const options = {
    method: 'GET',
    url: apiUrl,
    headers: {
      'x-AuthKey': API_KEY
    }
  };

  // Make the request to the external API
  request(options, function (error, response, body) {
    if (error) {
      return res.status(500).json({ error: error.message });
    }
    
    try {
      const data = JSON.parse(body);
      res.json(data);
    } catch (e) {
      res.send(body);
    }
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
