# MQTT Remote Control

A simple web application that allows you to control your wallpaper slideshow through MQTT messages. This app is designed to run on a Raspberry Pi and be accessible from any device on your home network.

## Features

- Simple, responsive UI with two buttons: "Previous" and "Next"
- Publishes MQTT messages to control wallpaper slideshow
- TV remote control via SwitchBot API integration
- SSH remote reboot functionality for computers on the local network
- Built with Node.js, Express, and MQTT.js
- Styled with Pico CSS for a clean, modern look
- Progressive Web App (PWA) support for mobile installation

## Prerequisites

- Node.js and npm installed on your Raspberry Pi
- MQTT broker running at 192.168.0.193:1883
- Network connectivity between your Raspberry Pi and MQTT broker
- For SSH reboot: Target computer with SSH enabled and appropriate credentials
- For TV control: SwitchBot Hub and compatible TV device

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

4. Configure environment variables:

```bash
cp .env.example .env
nano .env
```

Edit the `.env` file with your specific configuration:
- Set SSH credentials for remote reboot functionality
- Set SwitchBot API credentials for TV control
- Adjust MQTT broker settings if needed

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

3. Use the interface to control your devices:
   - **Wallpaper Controls**: Use "Previous" and "Next" buttons to control slideshow
   - **System Controls**: Use "Reboot Computer" to restart a remote computer via SSH
   - **TV Remote**: Control your TV through SwitchBot integration

## MQTT Topics

This application publishes to the following MQTT topics:

- `local/wallpaper/next` - When the "Next" button is clicked
- `local/wallpaper/previous` - When the "Previous" button is clicked

## SSH Reboot Configuration

To enable the remote reboot functionality, you need to configure SSH access to the target computer:

### Option 1: Password Authentication
```bash
# In your .env file
SSH_HOST=192.168.0.100
SSH_USERNAME=pi
SSH_PASSWORD=your_password_here
```

### Option 2: SSH Key Authentication (Recommended)
```bash
# Generate SSH key pair (if you don't have one)
ssh-keygen -t rsa -b 4096

# Copy public key to target computer
ssh-copy-id username@target_computer_ip

# In your .env file
SSH_HOST=192.168.0.100
SSH_USERNAME=pi
SSH_PRIVATE_KEY_PATH=/path/to/your/private/key
```

### Important Security Notes:
- The target user must have sudo privileges to execute `reboot`
- For passwordless sudo, add this line to sudoers: `username ALL=(ALL) NOPASSWD: /sbin/reboot`
- SSH key authentication is more secure than password authentication
- Test SSH connection manually before using the web interface

## Customization

- Edit `server.js` to change MQTT broker settings or port
- Modify `public/index.html` and `public/css/style.css` to customize the UI
- Update SSH configuration in `.env` file for different target computers

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
