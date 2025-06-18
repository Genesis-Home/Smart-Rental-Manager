# Image Sharing Utility

This utility provides functionality to download and share actual images instead of just URLs when sharing properties in the SmartRentalManager app.

## Features

- **Download Images**: Downloads images from URLs to the device's temporary directory
- **Share Actual Images**: Uses React Native's Share API to share actual image files
- **Fallback Support**: Falls back to sharing URLs if image download fails
- **Automatic Cleanup**: Cleans up downloaded files after sharing
- **Cross-Platform**: Works on both iOS and Android
- **Error Handling**: Comprehensive error handling and validation

## Functions

### `downloadImageForSharing(imageUrl: string): Promise<string | null>`

Downloads a single image from a URL to the device's temporary directory.

**Parameters:**
- `imageUrl`: The URL of the image to download

**Returns:**
- `Promise<string | null>`: The local file path if successful, null if failed

### `downloadMultipleImagesForSharing(imageUrls: string[]): Promise<string[]>`

Downloads multiple images from URLs to the device's temporary directory.

**Parameters:**
- `imageUrls`: Array of image URLs to download

**Returns:**
- `Promise<string[]>`: Array of local file paths for successfully downloaded images

### `cleanupSharedImages(filePaths: string[]): Promise<void>`

Deletes downloaded image files from the device.

**Parameters:**
- `filePaths`: Array of file paths to delete

### `isValidImageUrl(url: string): boolean`

Validates if a URL is a valid image URL.

**Parameters:**
- `url`: The URL to validate

**Returns:**
- `boolean`: True if the URL is valid, false otherwise

### `createFallbackShareMessage(title: string, description: string, address: string, imageUrls: string[], mapsUrl?: string): string`

Creates a fallback share message with image URLs when file sharing is not available.

**Parameters:**
- `title`: Property title
- `description`: Property description
- `address`: Property address
- `imageUrls`: Array of image URLs
- `mapsUrl`: Optional Google Maps URL

**Returns:**
- `string`: Formatted share message

## Usage Example

```typescript
import { downloadMultipleImagesForSharing, cleanupSharedImages } from '../utilities/imageDownloader';

const handleShare = async (property) => {
  try {
    // Download images for sharing
    const downloadedPaths = await downloadMultipleImagesForSharing(property.images);
    
    // Share with actual images
    await Share.share({
      message: 'Property details...',
      title: property.title,
      url: `file://${downloadedPaths[0]}`, // First image as main image
      urls: downloadedPaths.map(path => `file://${path}`) // All images
    });
    
    // Clean up downloaded files
    await cleanupSharedImages(downloadedPaths);
  } catch (error) {
    console.error('Sharing failed:', error);
  }
};
```

## Platform Support

- **iOS**: Uses `RNFS.TemporaryDirectoryPath` for temporary files
- **Android**: Uses `RNFS.CachesDirectoryPath` for temporary files

## Error Handling

The utility includes comprehensive error handling:
- Invalid URLs are filtered out
- Download failures are logged and handled gracefully
- File existence is verified after download
- Cleanup errors are logged but don't break the sharing flow

## Dependencies

- `react-native-fs`: For file system operations
- `react-native`: For platform detection 