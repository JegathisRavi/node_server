// https://node-server-0zpg.onrender.com


const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const cors = require('cors')
const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());
app.use(bodyParser.json());

let locations = [];
let coordinates = { latitude: 0, longitude: 0 };

// Endpoint to receive and store location coordinates
app.post('/saveLocation', async (req, res) => {
  const { latitude, longitude } = req.body;
  coordinates = { latitude, longitude };

  try {
    // const response = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`);
    // const placeName = response.data.display_name;

    const newLocation = { latitude, longitude, timestamp: new Date() };
    locations.push(newLocation);
    saveLocationsToFile();
    console.log('Location received :',placeName);
    res.json({ status: 'Location received', location: newLocation }); //to send response to App
  } catch (error) {
    console.error('Error fetching place name:', error);
    res.status(500).json({ error: 'Error fetching ' });
  }
});


// Function to save locations array to a JSON file
const saveLocationsToFile = () => {
  const filePath = path.join(__dirname, 'locations.json');
  fs.writeFile(filePath, JSON.stringify(locations, null, 2), (err) => {
    if (err) {
      console.error('Error saving locations:', err);
    } 
  });
};

// Endpoint to serve the map page
app.get('/map', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'map.html'));
});

// Endpoint to get the tracking data for visualization // used in HTML(for marker)
app.get('/tracking-data', (req, res) => {
  res.json(locations);
});

// Endpoint to render the Map
app.get('/', (req, res) => {
  res.send(`
    <html>
      <head>
        <style>
          html, body {
            height: 100%;
            margin: 0;
            display: flex;
            justify-content: center;
            align-items: center;
          }

          .center {
            text-align: center;
          }
        </style>
      </head>
      <body>
        <div class="center">
          <h1>Tracker App</h1>
          <form action="/map" method="get">
            <button type="submit">Map View</button>
          </form>
        </div>
      </body>
    </html>
  `);
});


app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
