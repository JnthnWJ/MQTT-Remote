const express = require('express');
const mqtt = require('mqtt');
const path = require('path');

// Create Express app
const app = express();
const port = 3000;

// MQTT Configuration
const mqttBroker = 'mqtt://192.168.0.193:1883';
const mqttClient = mqtt.connect(mqttBroker);
const topics = {
  next: 'local/wallpaper/next',
  previous: 'local/wallpaper/previous'
};

// Handle MQTT connection
mqttClient.on('connect', () => {
  console.log('Connected to MQTT broker');
});

mqttClient.on('error', (err) => {
  console.error('MQTT connection error:', err);
});

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// API endpoints
app.get('/api/wallpaper/next', (req, res) => {
  mqttClient.publish(topics.next, '');
  console.log('Published to topic:', topics.next);
  res.json({ success: true, action: 'next' });
});

app.get('/api/wallpaper/previous', (req, res) => {
  mqttClient.publish(topics.previous, '');
  console.log('Published to topic:', topics.previous);
  res.json({ success: true, action: 'previous' });
});

// Start the server
app.listen(port, '0.0.0.0', () => {
  console.log(`Server running at http://0.0.0.0:${port}`);
  console.log('Access this server from any device on your local network');
});
