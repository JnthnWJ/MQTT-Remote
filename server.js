const express = require('express');
const mqtt = require('mqtt');
const path = require('path');
const axios = require('axios');
require('dotenv').config();
const crypto = require('crypto');

// Create Express app
const app = express();
const port = 3000;

// SwitchBot API credentials
const switchbotToken = process.env.SWITCHBOT_TOKEN;
const switchbotSecret = process.env.SWITCHBOT_SECRET;

// MQTT Configuration
const mqttBroker = 'mqtt://192.168.0.193:1883'; // Replace with your MQTT broker address
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

// Function to generate SwitchBot API signature
function generateSwitchbotSignature() {
    const t = Date.now();
    const nonce = "requestID"; // Could be improved with a random UUID
    const data = switchbotToken + t + nonce;
    const sign = crypto
        .createHmac('sha256', switchbotSecret)
        .update(data)
        .digest('base64');
    return { sign, t, nonce };
}

// Middleware to parse JSON requests
app.use(express.json());

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

// SwitchBot API endpoints
app.post('/api/tv/:command', async (req, res) => {
    const { command } = req.params;
    const validCommands = ["Onoff", "Settings", "Home", "Back", "Playpause", "Volup", "Voldown", "Mute", "Up", "Down", "Left", "Right", "Enter"];

    if (!validCommands.includes(command)) {
        return res.status(400).json({ success: false, message: 'Invalid command' });
    }

    // We'll use the device ID for the TV
    const hubDeviceId = "E4FDCBAD8606"; // Hub device ID
    const tvDeviceId = "02-202502250756-40638993"; // TV device ID from the API response
    const { sign, t, nonce } = generateSwitchbotSignature();

    console.log("Sending command:", command);
    console.log("Hub Device ID:", hubDeviceId);
    console.log("TV Device ID:", tvDeviceId);
    console.log("Token:", switchbotToken ? "Token exists" : "Token is missing");
    console.log("Secret:", switchbotSecret ? "Secret exists" : "Secret is missing");

    const requestBody = {
        "command": command,
        "parameter": "default",
        "commandType": "customize"
    };
    
    console.log("Request body:", JSON.stringify(requestBody, null, 2));

    try {
        // Send the command to the TV device
        console.log(`Making request to: https://api.switch-bot.com/v1.1/devices/${tvDeviceId}/commands`);
        
        const response = await axios({
            method: 'POST',
            url: `https://api.switch-bot.com/v1.1/devices/${tvDeviceId}/commands`,
            headers: {
                "Authorization": switchbotToken,
                "sign": sign,
                "nonce": nonce,
                "t": t.toString(),
                'Content-Type': 'application/json',
            },
            data: requestBody
        });

        console.log("Response:", response.status, response.data);
        res.json({ success: true, message: `TV command '${command}' sent successfully`, data: response.data });

    } catch (error) {
        console.error("Error sending command to SwitchBot:", error);
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            res.status(error.response.status).json({ 
                success: false, 
                message: `Failed to send command '${command}'`, 
                data: error.response.data 
            });
        } else {
            res.status(500).json({ 
                success: false, 
                message: 'Internal server error', 
                error: error.message 
            });
        }
    }
});

// Start the server
app.listen(port, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${port}`);
    console.log('Access this server from any device on your local network');
});
