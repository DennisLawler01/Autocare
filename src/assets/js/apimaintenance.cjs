// start command : node src/assets/js/apimaintenance.cjs

const express = require('express');
const request = require('request');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

dotenv.config({ path: 'apikey.env' });

const app = express();

app.use(cors());

const API_KEY = process.env.API_KEY;

app.get('/vehicle/:year/:make/:model/:trim?', (req, res) => {
  const { year, make, model, trim } = req.params;
  
  let apiUrl = `https://api.vehicledatabases.com/vehicle-maintenance/v2/${year}/${make}/${model}`;
  if (trim) {
    const encodedTrim = encodeURIComponent(trim);
    apiUrl += `/${encodedTrim}`;
  }
  
  // api REQ
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
      console.error('Error fetching external API:', error);
      return res.status(500).json({ error: error.message });
    }
    
    let data;
    try {
      data = JSON.parse(body);
    } catch (parseErr) {
      console.error('Error parsing API response:', parseErr);
      return res.status(500).json({ error: 'Error parsing API response', body });
    }
    
    // Save the JSON file to the "pastinquaries" directory
    const dir = path.join(__dirname, '../pastinquaries');
    
    // Create the directory if it doesn't exist, with error handling
    try {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log('Directory created:', dir);
      }
    } catch (dirErr) {
      console.error('Error creating directory:', dirErr);
      return res.status(500).json({ error: 'Error creating directory' });
    }
    
    // Generate a unique filename using the parameters and a timestamp
    const timestamp = Date.now();
    // Replace spaces with underscores for filename safety
    const safeYear = year.replace(/\s/g, '_');
    const safeMake = make.replace(/\s/g, '_');
    const safeModel = model.replace(/\s/g, '_');
    const safeTrim = trim ? trim.replace(/\s/g, '_') : 'notrim';
    const filename = `${safeYear}_${safeMake}_${safeModel}_${safeTrim}_${timestamp}.json`;
    const filepath = path.join(dir, filename);
    
    fs.writeFile(filepath, JSON.stringify(data, null, 2), (err) => {
      if (err) {
        console.error('Error saving file:', err);
        return res.status(500).json({ error: 'Error saving file' });
      } else {
        console.log('Data saved to file:', filepath);
      }
    });
    
    // Return the data to the client
    res.json(data);
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});