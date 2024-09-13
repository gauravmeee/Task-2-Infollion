# Task by Infollion

### Task: Build a Simple API Proxy Server

##### Requirements:
1. [x] Create a Node.js application using Express.js.
2. [x]  Implement a single endpoint that acts as a proxy to a public API of your choice (e.g., GitHub, Weather API). 
3. Add rate limiting:
	- [x] a. Limit requests to 5 per minute per IP address.
	- [x] b. Return a 429 status code when the limit is exceeded.
4. Implement basic caching:
	- [x] a. Cache successful API responses for 5 minutes.
	- [x] b. Serve cached responses when available. 

5. [x] Add error handling for the external API calls.
6. [x] Implement logging for each request, including timestamp, IP address, and rate limit status.
Bonus:
7. [x] Implement a simple authentication mechanism for the proxy endpoint.
8. [x] Make the rate limit and cache duration configurable via environment variables.


## Setup

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
   
3. Create a `.env` file in the project root (Incase not pushed by me for security reasons.)
```
PORT=3000
RATE_LIMIT = 5
RATE_LIMIT_WINDOW = 60000
CACHE_DURATION = 300
API_KEY = your_secret_api_key_here # write your env
API_URL = your_url_of_public_api
```
   
   Replace `your_secret_api_key_here` with a secure API key of your choice.
   Replace `your_url_of_public_api` with any API url of your choice

*\*Note: I have uploaded my `.env` for your convenience, so feel skip the above  step.*


1. Start the server:
```sh
node server.js
```

## Usage

Send GET requests to `http://localhost:3000/api/proxy` with your API key in the `X-API-Key` header.

Example:
```sh
curl -H "X-API-Key: gkmeena@2810" http://localhost:3000/api/proxy
```

## Try this Test Cases for features assessments

Here are some test cases to verify the functionality of the API Proxy Server:

1. **Basic Functionality**
   - Send a GET request to `/api/proxy` with a valid ✅ API key = 'gkmeena@2810' in this case.
   - Expected: 200 OK response with data from the proxied API

```sh
curl -H "X-API-Key: gkmeena@2810" http://localhost:3000/api/proxy
```

2. **Authentication**
   - Send a GET request to `/api/proxy` without ❌ an API key
   - Expected: 401 Unauthorized response
```sh
curl http://localhost:3000/api/proxy
```

   - Send a GET request to `/api/proxy` with wrong ❌ API key
   - Expected: 401 Unauthorized response
```sh
curl -H "X-API-Key: gkmeena2810" http://localhost:3000/api/proxy
```

1. **Rate Limiting**
   - Send more than 5 requests within 1 minute (adjust based on your configuration)
   - Expected: 429 Too Many Requests response after limit is exceeded

use the for loop method for convenience 
```sh
for i in {1..6}; do curl -H "X-API-Key: your_secret_api_key_here" http://localhost:3000/api/proxy; echo; done
```

4. **Caching**
   - Send the same request twice within 5 minutes (or your configured cache duration)
   - Expected: Faster response time for the second request, indicating a cache hit

```sh
time curl -H "X-API-Key: your_secret_api_key_here" http://localhost:3000/api/proxy

time curl -H "X-API-Key: your_secret_api_key_here" http://localhost:3000/api/proxy
```


6. **Error Handling**
   - Modify the target api URL in the `.env` to an invalid URL
```
# existing .env
API_URL = 'https://infollion.com/'
```
   - Send a request to `/api/proxy`
   - Expected: 500 Internal Server Error response with an error message

7. **Logging**
   - Send various requests to the server
   - Expected: Check the console or log files for detailed logs of each request
   ex:
   ```
   Date-time=2024-09-13T16:39:31.551Z
    IP-address=::1
    Method=GET
    API-url=/api/proxy
    Status=401
    Response-time=2.505 ms
    Response-size=24
   ```


Remember to replace `your_secret_api_key_here` with your actual API key when running these tests.

## Configuration

You can modify the following environment variables in the `.env` file to adjust the server's behavior:

- `PORT`: The port on which the server runs
- `RATE_LIMIT`: Maximum number of requests allowed per time window
- `RATE_LIMIT_WINDOW`: Time window for rate limiting in milliseconds
- `CACHE_DURATION`: Duration to cache responses in seconds
- `API_KEY`: Secret key for API authentication


# Thankyou Infollion : )