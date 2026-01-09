#!/bin/bash
set -e

# =====================================================
# Oracle Cloud Deployment Script
# Blog + RAG Service
# =====================================================

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}=== OrangeC Full Stack Deployment ===${NC}"

# Check required env vars
if [ -z "$DOMAIN" ]; then
    echo -e "${RED}Error: DOMAIN is required${NC}"
    echo -e "${YELLOW}Usage: DOMAIN=yourdomain.com GEMINI_API_KEY=xxx ./deploy-oracle.sh${NC}"
    exit 1
fi

if [ -z "$GEMINI_API_KEY" ]; then
    echo -e "${YELLOW}Warning: GEMINI_API_KEY not set. RAG service will not work.${NC}"
fi

echo -e "${GREEN}Deploying to: $DOMAIN${NC}"

# 1. Update system
echo -e "${YELLOW}[1/7] Updating system...${NC}"
sudo apt update && sudo apt upgrade -y

# 2. Install Docker
echo -e "${YELLOW}[2/7] Installing Docker...${NC}"
if ! command -v docker &> /dev/null; then
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    sudo usermod -aG docker $USER
    rm get-docker.sh
    echo -e "${YELLOW}Please log out and log back in, then run this script again.${NC}"
    exit 0
fi

# 3. Install Docker Compose
echo -e "${YELLOW}[3/7] Installing Docker Compose...${NC}"
if ! command -v docker-compose &> /dev/null; then
    sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
fi

# 4. Create .env file
echo -e "${YELLOW}[4/7] Creating environment file...${NC}"
cat > .env << EOF
DOMAIN=$DOMAIN
GEMINI_API_KEY=$GEMINI_API_KEY
EOF

# 5. Update nginx config with domain
echo -e "${YELLOW}[5/7] Configuring nginx for $DOMAIN...${NC}"
sed -i "s/YOUR_DOMAIN/$DOMAIN/g" nginx/nginx.conf
sed -i "s/server_name _;/server_name $DOMAIN;/g" nginx/nginx.conf

# 6. Setup SSL directories
echo -e "${YELLOW}[6/7] Setting up SSL...${NC}"
mkdir -p certbot/conf certbot/www

# Create initial nginx config (HTTP only for certbot)
cat > nginx/nginx-init.conf << 'EOF'
events {
    worker_connections 1024;
}
http {
    upstream blog {
        server blog:3000;
    }
    upstream rag {
        server rag:7073;
    }
    server {
        listen 80;
        server_name _;
        
        location /.well-known/acme-challenge/ {
            root /var/www/certbot;
        }
        
        location / {
            proxy_pass http://blog;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
        }
        
        location /api/chat {
            proxy_pass http://rag/api/chat;
            proxy_set_header Connection '';
            proxy_buffering off;
        }
        
        location /api/search {
            proxy_pass http://rag/api/search;
        }
    }
}
EOF

# 7. Build and deploy
echo -e "${YELLOW}[7/7] Building and starting services...${NC}"

# Start with HTTP-only nginx first
docker-compose build

# Temporarily use init config
cp nginx/nginx.conf nginx/nginx-ssl.conf
cp nginx/nginx-init.conf nginx/nginx.conf

docker-compose up -d

# Wait for services to start
echo -e "${YELLOW}Waiting for services to start...${NC}"
sleep 10

# Get SSL certificate
echo -e "${YELLOW}Getting SSL certificate for $DOMAIN...${NC}"
docker-compose run --rm certbot certonly --webroot --webroot-path=/var/www/certbot \
    --email admin@$DOMAIN --agree-tos --no-eff-email \
    -d $DOMAIN

# Restore SSL nginx config
cp nginx/nginx-ssl.conf nginx/nginx.conf

# Restart nginx with SSL
docker-compose restart nginx

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}  Deployment Complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "Blog:     ${GREEN}https://$DOMAIN${NC}"
echo -e "RAG API:  ${GREEN}https://$DOMAIN/api/chat${NC}"
echo ""
echo -e "${YELLOW}To check logs:${NC}"
echo "  docker-compose logs -f blog"
echo "  docker-compose logs -f rag"
echo ""
