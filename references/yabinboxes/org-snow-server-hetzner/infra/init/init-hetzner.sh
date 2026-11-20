#!/bin/bash

# Exit immediately if a command fails
set -e

echo "Updating system..."
apt update && apt upgrade -y

echo "Installing essential packages..."
apt install -y \
  apt-transport-https \
  ca-certificates \
  curl \
  software-properties-common \
  gnupg \
  git


echo "Installing Docker..."

# Remove any old docker keys (safe if none exist)
sudo rm -f /etc/apt/keyrings/docker.gpg

# Create keyrings directory if needed
sudo install -m 0755 -d /etc/apt/keyrings

# Download and install Docker’s official GPG key
curl -fsSL https://download.docker.com/linux/ubuntu/gpg \
  | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

# Ensure correct permissions
sudo chmod a+r /etc/apt/keyrings/docker.gpg

echo \
"deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] \
https://download.docker.com/linux/ubuntu noble stable" \
| sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt update

sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin



echo "Configuring Docker log rotation..."
mkdir -p /etc/docker
cat > /etc/docker/daemon.json <<EOF
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  }
}
EOF

echo "Enabling Docker service..."
systemctl enable docker
systemctl start docker

docker --version
