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

// Helper to sanitize strings for filenames
const toSafeName = str => str ? str.replace(/\s/g, '_') : '';

app.get('/vehicle/:year/:make/:model/:trim?', (req, res) => {
  const { year, make, model, trim } = req.params;

  // Path to /src/assets/pastinquaries
  const dir = path.resolve(__dirname, '../pastinquaries');
  console.log('📁 Checking directory:', dir);

  const safeYear = toSafeName(year);
  const safeMake = toSafeName(make);
  const safeModel = toSafeName(model);
  const safeTrim = toSafeName(trim || 'notrim');

  const matchPrefix = `${safeYear}_${safeMake}_${safeModel}_`;
  console.log('🔍 Looking for file starting with:', matchPrefix);

  fs.readdir(dir, (err, files) => {
    if (err) {
      console.error('❌ Failed to read pastinquaries folder:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    const matchedFile = files.find(file => file.startsWith(matchPrefix));

    if (matchedFile) {
      const filePath = path.join(dir, matchedFile);
      console.log('✅ Found cached file:', matchedFile);
      fs.readFile(filePath, 'utf8', (err, content) => {
        if (err) {
          console.error('❌ Error reading file:', err);
          return res.status(500).json({ error: 'Error reading cached data' });
        }
        res.setHeader('Content-Type', 'application/json');
        res.send(content);
      });
    } else {
      console.log('🌐 No local file found — making API call...');

      let apiUrl = `https://api.vehicledatabases.com/vehicle-maintenance/v2/${year}/${make}/${model}`;
      if (trim) apiUrl += `/${encodeURIComponent(trim)}`;

      const options = {
        method: 'GET',
        url: apiUrl,
        headers: { 'x-AuthKey': API_KEY }
      };

      request(options, (error, response, body) => {
        if (error) {
          console.error('❌ API request failed:', error);
          return res.status(500).json({ error: error.message });
        }

        let data;
        try {
          data = JSON.parse(body);
        } catch (parseErr) {
          console.error('❌ Failed to parse API response:', parseErr);
          return res.status(500).json({ error: 'Invalid JSON from API' });
        }

        const timestamp = Date.now();
        const filename = `${safeYear}_${safeMake}_${safeModel}_${safeTrim}_${timestamp}.json`;
        const filepath = path.join(dir, filename);

        fs.writeFile(filepath, JSON.stringify(data, null, 2), (err) => {
          if (err) {
            console.error('❌ Error saving file:', err);
          } else {
            console.log('💾 Saved new file:', filename);
          }
        });

        res.json(data);
      });
    }
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
