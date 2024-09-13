const express = require('express');
const axios = require('axios');
const rateLimit = require('express-rate-limit');
const NodeCache = require('node-cache');
const dotenv = require('dotenv');
const morgan = require('morgan');

dotenv.config();

const app = express();

// Set up configuration variables from environment (.env file) or default values
const PORT = process.env.PORT || 3000;
const RATE_LIMIT = process.env.RATE_LIMIT || 5;
const RATE_LIMIT_WINDOW = process.env.RATE_LIMIT_WINDOW || 60000; //1 minute in milliseconds
const CACHE_DURATION = process.env.CACHE_DURATION || 300; // 5 minutes in seconds
const API_URL = process.env.API_URL || 'https://api.github.com/users/gauravmeee'

// Create a new cache instance with the specified cache duration in environment variable
const cache = new NodeCache({ stdTTL: CACHE_DURATION });

// Configure rate limiting
const limiter = rateLimit({
  windowMs: RATE_LIMIT_WINDOW, // Window time (for rate limit)
  max: RATE_LIMIT, // Maximum no. of requests allowed per window
  message: 'Too many requests, please try again later.',
  statusCode: 429, // If rate limit exceed, return the http status code '429'
});

// Middleware to log HTTP requests in a specified format:
app.use(morgan(`-> Date-time=:date[iso]
    IP-address=:remote-addr
    Method=:method
    API-url=:url
    Status=:status
    Response-time=:response-time ms
    Response-size=:res[content-length]
    `
)); // used '`' backticks for newline auto format


// Apply rate limiting to all the requests
app.use(limiter);

// Simple log authentication middleware
const authenticate = (req, res, next) => {
  const apiKey = req.headers['x-api-key']; // Retrieve API key from request headers
  if (apiKey === process.env.API_KEY) { // compare the the API_KEY from '.env' if valid or not.
    next(); // If valid, pass control to the next middleware or route handler

  } else {
    res.status(401).json({ error: 'Unauthorized' }); // If invalid, respond with 401 Unauthorized
  }
};

// route handler for proxy endpoint
app.get('/api/proxy', authenticate, async (req, res) => {
  const targetUrl = API_URL; // Example: GitHub API

  try {
    // Check if the response is stored in cache for our target url
    const cachedResponse = cache.get(targetUrl);
    if (cachedResponse) {
      return res.json(cachedResponse); // if in cache, return the response
    }

    // If not in cache, make request to external API
    const response = await axios.get(targetUrl);
    
    // Cache the response for future request
    cache.set(targetUrl, response.data);

    // Send the response data to us
    res.json(response.data);
  } catch (error) {
    console.error('Error calling external API:', error.message);
    res.status(500).json({ error: 'Error calling external API' });
  }
});

// Start the server and listen for incoming requests on the specified port mentioned in our environment variable
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});