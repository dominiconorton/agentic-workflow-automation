const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Proxy configuration
const proxyOptions = {
  target: 'https://my-first-crew-a86bee54-4d62-4ae2-bf57-69720-23b0b540.crewai.com',
  changeOrigin: true,
  onProxyReq: (proxyReq, req, res) => {
    // Add the Bearer token to the Authorization header
    proxyReq.setHeader('Authorization', 'Bearer a30e0382f73a');

    // Ensure the Content-Type is set to application/json
    if (req.body) {
      const bodyData = JSON.stringify(req.body);
      proxyReq.setHeader('Content-Type', 'application/json');
      proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
      proxyReq.write(bodyData);
    }
  },
  onProxyRes: (proxyRes, req, res) => {
    // Modify the response headers to include CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  },
};

// Use the proxy middleware
app.use('/', createProxyMiddleware(proxyOptions));

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Proxy server is running on port ${PORT}`);
});