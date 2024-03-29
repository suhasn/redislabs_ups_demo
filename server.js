

// Import the installed modules.
const express = require('express');
const responseTime = require('response-time')
const axios = require('axios');
const redis = require('redis');
const xsenv = require('@sap/xsenv');

const app = express();

var host = '';
var port;
var password;

if (process.env.VCAP_SERVICES) {
    // running in cloud
    host = xsenv.cfServiceCredentials('redislabsdemodb').uri;
    port = xsenv.cfServiceCredentials('redislabsdemodb').port;
    password = xsenv.cfServiceCredentials('redislabsdemodb').password;
} else {
    console.log('running locally is not supported');
    return;
}

/* Values are hard-coded for this example, it's usually best to bring these in via file or environment variable for production */
const client  = redis.createClient({
  port      : port,               // replace with your port
  host      : host,        // replace with your hostanme or IP address
  password  : password,    // replace with your password
});

// Print redis errors to the console
client.on('error', (err) => {
  console.log("Error " + err);
});

// use response-time as a middleware
app.use(responseTime());


// create an api/search route
app.get('/api/search', (req, res) => {
  // Extract the query from url and trim trailing spaces
  const query = (req.query.query).trim();
  // Build the Wikipedia API url
  const searchUrl = `https://en.wikipedia.org/w/api.php?action=parse&format=json&section=0&page=${query}`;

  // Try fetching the result from Redis first in case we have it cached
  return client.get(`wikipedia:${query}`, (err, result) => {
    // If that key exist in Redis store
    if (result) {
      const resultJSON = JSON.parse(result);
      return res.status(200).json(resultJSON);
    } else { // Key does not exist in Redis store
      // Fetch directly from Wikipedia API
      return axios.get(searchUrl)
        .then(response => {
          const responseJSON = response.data;
          // Save the Wikipedia API response in Redis store
          client.setex(`wikipedia:${query}`, 3600, JSON.stringify({ source: 'Redis Cache', ...responseJSON, }));
          // Send JSON response to client
          return res.status(200).json({ source: 'Wikipedia API', ...responseJSON, });
        })
        .catch(err => {
          return res.json(err);
        });
    }
  });
});
var APP_PORT = process.env.PORT || 8080;
app.listen(APP_PORT, () => {
  console.log('Server listening on port: ', APP_PORT);
});
