#!/bin/bash
set -e

# =====================================================
# Oracle Cloud Deployment Script for OrangeC Blog
# =====================================================

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}=== OrangeC Blog Deployment ===${NC}"

# Check if domain is set
if [ -z "$DOMAIN" ]; then
    echo -e "${YELLOW}Usage: DOMAIN=yourdomain.com ./deploy.sh${NC}"
    echo -e "${RED}Please set your domain!${NC}"
    exit 1
fi

echo -e "${GREEN}Deploying to: $DOMAIN${NC}"

# 1. Update system
echo -e "${YELLOW}[1/6] Updating system...${NC}"
sudo apt update && sudo apt upgrade -y

# 2. Install Docker
echo -e "${YELLOW}[2/6] Installing Docker...${NC}"
if ! command -v docker &> /dev/null; then
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    sudo usermod -aG docker $USER
    rm get-docker.sh
fi

# 3. Install Docker Compose
echo -e "${YELLOW}[3/6] Installing Docker Compose...${NC}"
if ! command -v docker-compose &> /dev/null; then
    sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
fi

# 4. Update nginx config with domain
echo -e "${YELLOW}[4/6] Configuring nginx for $DOMAIN...${NC}"
sed -i "s/YOUR_DOMAIN/$DOMAIN/g" nginx/nginx.conf
sed -i "s/server_name _;/server_name $DOMAIN;/g" nginx/nginx.conf

# 5. Create SSL certificate directories
echo -e "${YELLOW}[5/6] Setting up SSL...${NC}"
mkdir -p certbot/conf certbot/www

# Initial nginx without SSL for certbot challenge
cat > nginx/nginx-init.conf << 'EOF'
events {
    worker_connections 1024;
}
http {
    server {
        listen 80;
        server_name _;
        location /.well-known/acme-challenge/ {
            root /var/www/certbot;
        }
        location / {
            proxy_pass http://blog:3000;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
        }
    }
}
EOF

# 6. Build and start
echo -e "${YELLOW}[6/6] Building and starting services...${NC}"

# First run without SSL
docker-compose build
NGINX_CONF=nginx/nginx-init.conf docker-compose up -d blog nginx

# Get SSL certificate
echo -e "${YELLOW}Getting SSL certificate...${NC}"
docker-compose run --rm certbot certonly --webroot --webroot-path=/var/www/certbot \
    --email your-email@example.com --agree-tos --no-eff-email \
    -d $DOMAIN

# Restart with full SSL config
docker-compose down
docker-compose up -d

echo -e "${GREEN}=== Deployment Complete! ===${NC}"
echo -e "${GREEN}Your blog is now live at: https://$DOMAIN${NC}"
