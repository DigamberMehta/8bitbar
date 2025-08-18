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

echo "Starting enhanced download of ${#images[@]} images..."
echo "Note: Some images might be protected and require manual download"
echo ""

# Download each image with different methods
for url in "${images[@]}"; do
    # Extract filename from URL
    filename=$(basename "$url")
    
    echo "Attempting to download: $filename"
    
    # Method 1: Try with User-Agent header
    if curl -L -A "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36" -o "images/$filename" "$url" 2>/dev/null; then
        # Check if it's actually an image
        if file "images/$filename" | grep -q "image\|JPEG\|PNG\|GIF"; then
            echo "✅ Successfully downloaded: $filename"
        else
            echo "⚠️  Downloaded but not an image (might be HTML): $filename"
            # Remove the non-image file
            rm "images/$filename"
        fi
    else
        echo "❌ Failed to download: $filename"
    fi
    
    # Small delay between downloads
    sleep 1
done

echo ""
echo "Download attempt complete!"
echo ""

# Check what we actually have
echo "Checking downloaded files:"
if [ -d "images" ] && [ "$(ls -A images)" ]; then
    echo "Files in images/ folder:"
    ls -la images/
    
    echo ""
    echo "File types:"
    for file in images/*; do
        if [ -f "$file" ]; then
            echo "$(basename "$file"): $(file "$file")"
        fi
    done
else
    echo "No images were successfully downloaded."
fi

echo ""
echo "If images couldn't be downloaded automatically, you may need to:"
echo "1. Visit 8bitbar.com.au in your browser"
echo "2. Right-click on images and 'Save Image As...'"
echo "3. Save them to the images/ folder"
echo "4. Or contact the website owner for direct access to images"
