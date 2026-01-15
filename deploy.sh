#!/bin/bash
set -e

# Load environment variables
if [ -f .env ]; then
    export $(grep -v '^#' .env | xargs)
else
    echo "Error: .env file not found. Copy .env.example to .env and fill in your values."
    exit 1
fi

# Defaults
DOCKER_HOST=${DOCKER_HOST:-10.5.0.99}
DOCKER_USER=${DOCKER_USER:-root}
N8N_CONTAINER_NAME=${N8N_CONTAINER_NAME:-n8n}
N8N_VOLUME_PATH=${N8N_VOLUME_PATH:-/media/data/docker/volumes/n8n_data/_data}
NODE_NAME="n8n-nodes-planning-center"

echo "🔨 Building node..."
npm run build

echo "📦 Packing node..."
npm pack

# Get the tarball name
TARBALL=$(ls -t ${NODE_NAME}-*.tgz | head -1)
echo "   Created: $TARBALL"

echo "📤 Copying to Docker host ($DOCKER_HOST)..."
sshpass -p "$DOCKER_PASSWORD" scp "$TARBALL" ${DOCKER_USER}@${DOCKER_HOST}:/tmp/

echo "🔧 Installing on Docker host..."
sshpass -p "$DOCKER_PASSWORD" ssh ${DOCKER_USER}@${DOCKER_HOST} << EOF
    set -e

    # Create nodes directory if it doesn't exist
    mkdir -p ${N8N_VOLUME_PATH}/nodes

    # Remove old installation if exists
    rm -rf ${N8N_VOLUME_PATH}/nodes/${NODE_NAME}

    # Extract new version
    cd ${N8N_VOLUME_PATH}/nodes
    tar -xzf /tmp/${TARBALL}
    mv package ${NODE_NAME}

    # Install production dependencies
    cd ${NODE_NAME}
    npm install --omit=dev --legacy-peer-deps 2>/dev/null || true

    # Fix permissions for n8n user (uid 1000)
    chown -R 1000:1000 ${N8N_VOLUME_PATH}/nodes

    # Clean up
    rm /tmp/${TARBALL}

    echo "   Node installed at: ${N8N_VOLUME_PATH}/nodes/${NODE_NAME}"
EOF

echo "🔄 Restarting n8n container..."
sshpass -p "$DOCKER_PASSWORD" ssh ${DOCKER_USER}@${DOCKER_HOST} << EOF
    # Check if N8N_CUSTOM_EXTENSIONS is set
    CURRENT_ENV=\$(docker inspect ${N8N_CONTAINER_NAME} --format '{{range .Config.Env}}{{println .}}{{end}}' | grep N8N_CUSTOM_EXTENSIONS || true)

    if [ -z "\$CURRENT_ENV" ]; then
        echo "   ⚠️  N8N_CUSTOM_EXTENSIONS not set. You need to recreate the container with:"
        echo "   docker stop ${N8N_CONTAINER_NAME}"
        echo "   docker rm ${N8N_CONTAINER_NAME}"
        echo "   docker run -d --name ${N8N_CONTAINER_NAME} --restart unless-stopped -p 5678:5678 \\"
        echo "     -e WEBHOOK_URL=https://automate.dylanlambert.me \\"
        echo "     -e N8N_CUSTOM_EXTENSIONS=/home/node/.n8n/nodes \\"
        echo "     -v n8n_data:/home/node/.n8n \\"
        echo "     docker.n8n.io/n8nio/n8n:latest"
    else
        docker restart ${N8N_CONTAINER_NAME}
        echo "   Container restarted"
    fi
EOF

# Clean up local tarball
rm "$TARBALL"

echo ""
echo "✅ Deployment complete!"
echo "   Node: ${NODE_NAME}"
echo "   Host: ${DOCKER_HOST}"
echo ""
echo "Open n8n and search for 'Planning Center' to verify installation."
