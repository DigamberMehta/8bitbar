#!/bin/bash

# Create images directory if it doesn't exist
mkdir -p images

# Array of image URLs to download
declare -a images=(
    "https://8bitbar.com.au/wp-content/uploads/2025/02/logo-1.png"
    "https://8bitbar.com.au/wp-content/uploads/2025/03/476430123_503383535925338_3430500913908929137_n-1.jpg"
    "https://8bitbar.com.au/wp-content/uploads/2025/03/20250419_212301-scaled.jpg"
    "https://8bitbar.com.au/wp-content/uploads/2025/03/mario-kart.jpeg"
    "https://8bitbar.com.au/wp-content/uploads/2025/05/4d7846ed-b5ad-4444-bba5-35271a0d87bc-500x500.jpeg"
    "https://8bitbar.com.au/wp-content/uploads/2025/05/0b42d0ef-96db-40f0-abf4-51edbb96ac42-e1748892865932.jpeg"
    "https://8bitbar.com.au/wp-content/uploads/2025/05/eab1029c-b6c9-430c-b0e2-0e80fff6aa21.jpeg"
    "https://8bitbar.com.au/wp-content/uploads/2025/05/0b42d0ef-96db-40f0-abf4-51edbb96ac42-1536x865.jpeg"
    "https://8bitbar.com.au/wp-content/uploads/2025/05/275bbbcf-cb28-4acf-b4b2-2fede476aeca.jpeg"
    "https://8bitbar.com.au/wp-content/uploads/2025/05/openart-a8d36e2a-b3ee-4dcc-b348-5fef533e0550.jpeg"
    "https://8bitbar.com.au/wp-content/uploads/2025/05/20250419_225434-1153x2048.jpg"
    "https://8bitbar.com.au/wp-content/uploads/2025/06/map-layout-0-resturant-scaled.jpg"
)

echo "Starting download of ${#images[@]} images..."

# Download each image
for url in "${images[@]}"; do
    # Extract filename from URL
    filename=$(basename "$url")
    
    echo "Downloading: $filename"
    
    # Download the image
    if curl -L -o "images/$filename" "$url"; then
        echo "✅ Successfully downloaded: $filename"
    else
        echo "❌ Failed to download: $filename"
    fi
done

echo "Download complete! Check the images/ folder."
echo "Total images downloaded: $(ls images/ | wc -l)"
