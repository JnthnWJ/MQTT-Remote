# MQTT Remote Control

A simple web application that allows you to control your wallpaper slideshow through MQTT messages. This app is designed to run on a Raspberry Pi and be accessible from any device on your home network.

## Features

- Simple, responsive UI with two buttons: "Previous" and "Next"
- Publishes MQTT messages to control wallpaper slideshow
- Built with Node.js, Express, and MQTT.js
- Styled with Pico CSS for a clean, modern look

## Prerequisites

- Node.js and npm installed on your Raspberry Pi
- MQTT broker running at 192.168.0.193:1883
- Network connectivity between your Raspberry Pi and MQTT broker

## Installation

1. Clone or copy this repository to your Raspberry Pi:

```bash
git clone <repository-url>
# or copy the files manually
```

2. Navigate to the project directory:

```bash
cd mqtt-remote
```

3. Install dependencies:

```bash
npm install
```

## Usage

1. Start the server:

```bash
npm start
```

2. Access the web interface from any device on your home network:

```
http://<raspberry-pi-ip-address>:3000
```

Replace `<raspberry-pi-ip-address>` with the actual IP address of your Raspberry Pi.

3. Use the "Previous" and "Next" buttons to control your wallpaper slideshow.

## MQTT Topics

This application publishes to the following MQTT topics:

- `local/wallpaper/next` - When the "Next" button is clicked
- `local/wallpaper/previous` - When the "Previous" button is clicked

## Customization

- Edit `server.js` to change MQTT broker settings or port
- Modify `public/index.html` and `public/css/style.css` to customize the UI

## Running as a Service

To make the application start automatically when your Raspberry Pi boots up, you can set it up as a systemd service:

1. Create a service file:

```bash
sudo nano /etc/systemd/system/mqtt-remote.service
```

2. Add the following content (adjust paths as needed):

```
[Unit]
Description=MQTT Remote Control Web App
After=network.target

[Service]
ExecStart=/usr/bin/node /home/pi/mqtt-remote/server.js
WorkingDirectory=/home/pi/mqtt-remote
StandardOutput=inherit
StandardError=inherit
Restart=always
User=pi

[Install]
WantedBy=multi-user.target
```

3. Enable and start the service:

```bash
sudo systemctl enable mqtt-remote.service
sudo systemctl start mqtt-remote.service
```

4. Check the status:

```bash
sudo systemctl status mqtt-remote.service
