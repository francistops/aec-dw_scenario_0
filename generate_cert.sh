#!/bin/sh

CERT_DIR="./certs"
CERT_FILE="$CERT_DIR/server.crt"
KEY_FILE="$CERT_DIR/server.key"

# Create certs directory if it doesn't exist
mkdir -p $CERT_DIR

# Check if the certificate already exists, otherwise generate it
if [ ! -f "$CERT_FILE" ] || [ ! -f "$KEY_FILE" ]; then
    echo "Generating self-signed certificate..."
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
        -keyout "$KEY_FILE" -out "$CERT_FILE" -subj "/CN=localhost"
    echo "Self-signed certificate generated."
else
    echo "Certificate already exists. Skipping generation."
fi

