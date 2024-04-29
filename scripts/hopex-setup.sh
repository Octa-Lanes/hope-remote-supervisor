#!/bin/bash

# Exit on error
set -e

# Function to check if a package is installed
is_installed() {
    dpkg -s "$1" &> /dev/null
}

# Function to print status messages
print_status() {
    echo "===================================="
    echo "$1"
    echo "===================================="
}

# Check if the script is running in the correct directory
if [ "$(pwd)" != "/home/sun108/Desktop" ]; then
    echo "This script must be run from /home/sun108/Desktop"
    exit 1
fi

# Check if pgrok configuration file exists
if ! sudo test -f "/root/.config/pgrok/pgrok.yml"; then
    echo "pgrok configuration file not found at /root/.config/pgrok/pgrok.yml. Exiting."
    exit 1
fi

# 1. Install and setup Node.js
print_status "Installing Node.js"
if is_installed "nodejs"; then
    echo "Node.js is already installed."
else
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt-get install -y nodejs
    echo "Node.js version 20 has been installed."
fi

# 2. Install and setup Git
print_status "Installing Git"
if is_installed "git"; then
    echo "Git is already installed."
else
    sudo apt-get install -y git
    echo "Git has been installed."
fi

# 3. Install Supervisor app
print_status "Setting up Supervisor App"
sudo rm -rf /home/sun108/Desktop/hope-remote-supervisor
if ! sudo git clone https://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@github.com/Octa-Lanes/hope-remote-supervisor.git; then
    echo "Failed to clone repository."
    exit 1
fi
cd hope-remote-supervisor
if ! type pnpm > /dev/null; then
    echo "pnpm not found, installing it globally..."
    sudo npm install -g pnpm
fi
# Proceed with pnpm install
echo "Installing dependencies using pnpm..."
if ! sudo env "PATH=$PATH" pnpm install; then
    echo "Failed to install dependencies."
    exit 1
fi
sudo bash -c 'cat > .env <<EOF
MQTT_HOST="mqtt://broker.hivemq.com:1883"
PGROK_CONFIG="/root/.config/pgrok/pgrok.yml"
TEMP_LOG_DIR='/dev/shm/supervisor'
EOF'
if ! sudo npm run build; then
    echo "Failed to build project."
    exit 1
fi
cd ..
echo "Supervisor app has been cloned and built."

# 4. Install and setup pgrok
print_status "Installing pgrok"
sudo curl https://pgrok-executable.s3.ap-southeast-1.amazonaws.com/pgrok -o pgrok
sudo chmod +x pgrok
sudo rm -f /usr/bin/pgrok
sudo mv pgrok /usr/bin/pgrok
echo "pgrok has been installed and setup."

# App log folder
print_status "Creating app log folder"
sudo rm -rf /dev/shm/supervisor
sudo mkdir -p /dev/shm/supervisor

# 5. Setup systemd services
print_status "Configuring systemd services"

# pgrok service for ports 22 and 5900
sudo rm -f /etc/systemd/system/pgrok-ssh.service
sudo bash -c 'cat > /etc/systemd/system/pgrok-ssh.service <<EOF
[Service]
Environment="HOME=/root"
ExecStart=pgrok tcp 22
Restart=always

[Install]
WantedBy=multi-user.target
EOF'

sudo rm -f /etc/systemd/system/pgrok-vnc.service
sudo bash -c 'cat > /etc/systemd/system/pgrok-vnc.service <<EOF
[Service]
Environment="HOME=/root"
ExecStart=pgrok tcp 5900
Restart=always

[Install]
WantedBy=multi-user.target
EOF'

# Supervisor app service
sudo rm -f /etc/systemd/system/supervisor.service
sudo bash -c 'cat > /etc/systemd/system/supervisor.service <<EOF
[Unit]
Description=Supervisor App
After=network.target

[Service]
EnvironmentFile=/home/sun108/Desktop/hope-remote-supervisor/.env
WorkingDirectory=/home/sun108/Desktop/hope-remote-supervisor
ExecStart=node dist/main.js
Restart=always
User=root
Group=root
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=myapp

[Install]
WantedBy=multi-user.target
EOF'

sudo systemctl daemon-reload
sudo systemctl enable supervisor.service
sudo systemctl start supervisor.service

echo "Systemd services for pgrok and Supervisor app have been configured and started."

print_status "Installation Complete"
