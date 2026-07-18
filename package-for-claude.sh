#!/bin/bash

# Project name
PROJECT=$(basename "$PWD")

# Save ZIP to Desktop
DESKTOP="$HOME/Desktop"

ZIP_NAME="${PROJECT}_claude2.zip"
ZIP_PATH="$DESKTOP/$ZIP_NAME"

echo "📦 Packaging project for Claude..."
echo ""

# Remove old ZIP if it exists
rm -f "$ZIP_PATH"

# Create ZIP
zip -r "$ZIP_PATH" . \
-x "node_modules/*" \
-x ".git/*" \
-x "build/*" \
-x "dist/*" \
-x ".next/*" \
-x ".turbo/*" \
-x ".cache/*" \
-x ".parcel-cache/*" \
-x "coverage/*" \
-x ".vscode/*" \
-x ".idea/*" \
-x ".env.local" \
-x ".env" \
-x "*.log" \
-x ".DS_Store"

echo ""
echo "✅ Package created successfully!"
echo "📁 Location:"
echo "$ZIP_PATH"