$certDir = "./certs"
$certFile = "$certDir/server.crt"
$keyFile = "$certDir/server.key"

# Create the directory if it doesn't exist
if (!(Test-Path -PathType Container $certDir)) {
    New-Item -ItemType Directory -Path $certDir
}

# Generate self-signed certificate if it doesn't exist
if (!(Test-Path $certFile) -or !(Test-Path $keyFile)) {
    Write-Host "Generating self-signed certificate..."
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 `
        -keyout $keyFile -out $certFile -subj "/CN=localhost"
    Write-Host "Self-signed certificate generated."
} else {
    Write-Host "Certificate already exists. Skpping generation."
}

