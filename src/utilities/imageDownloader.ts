import RNFS from 'react-native-fs';
import { Platform } from 'react-native';

export const downloadImageForSharing = async (imageUrl: string): Promise<string | null> => {
  try {
    // Validate URL
    if (!imageUrl || typeof imageUrl !== 'string') {
      console.error('Invalid image URL:', imageUrl);
      return null;
    }

    console.log('Starting download for URL:', imageUrl);

    // Create a unique filename with proper extension
    const urlParts = imageUrl.split('.');
    const extension = urlParts.length > 1 ? urlParts[urlParts.length - 1].split('?')[0] : 'jpg';
    const fileName = `shared_image_${Date.now()}_${Math.random().toString(36).substring(7)}.${extension}`;
    
    // Get the appropriate temp directory based on platform
    const tempDir = Platform.OS === 'ios' ? RNFS.TemporaryDirectoryPath : RNFS.CachesDirectoryPath;
    const filePath = `${tempDir}/${fileName}`;
    
    console.log('Downloading to path:', filePath);
    
    // Check if file already exists
    const exists = await RNFS.exists(filePath);
    if (exists) {
      console.log(`File already exists: ${filePath}`);
      return filePath;
    }
    
    // Download the image
    const response = await RNFS.downloadFile({
      fromUrl: imageUrl,
      toFile: filePath,
      background: true,
      discretionary: true,
      progress: (res) => {
        console.log(`Downloaded ${res.bytesWritten} of ${res.contentLength} bytes`);
      },
    }).promise;
    
    console.log('Download response status:', response.statusCode);
    
    if (response.statusCode === 200) {
      // Verify the file was actually created and has content
      const fileExists = await RNFS.exists(filePath);
      if (fileExists) {
        const fileStats = await RNFS.stat(filePath);
        console.log('File size:', fileStats.size);
        
        if (fileStats.size > 0) {
          console.log(`Image downloaded successfully to: ${filePath}`);
          return filePath;
        } else {
          console.error('Downloaded file is empty');
          await RNFS.unlink(filePath).catch(() => {});
          return null;
        }
      } else {
        console.error('File was not created after download');
        return null;
      }
    } else {
      console.error('Failed to download image:', response.statusCode);
      return null;
    }
  } catch (error) {
    console.error('Error downloading image:', error);
    return null;
  }
};

export const downloadMultipleImagesForSharing = async (imageUrls: string[]): Promise<string[]> => {
  try {
    if (!imageUrls || imageUrls.length === 0) {
      return [];
    }

    // Filter out invalid URLs
    const validUrls = imageUrls.filter(url => url && typeof url === 'string');
    
    if (validUrls.length === 0) {
      console.warn('No valid image URLs provided');
      return [];
    }

    console.log(`Starting download of ${validUrls.length} images`);
    
    const downloadPromises = validUrls.map(url => downloadImageForSharing(url));
    const downloadedPaths = await Promise.all(downloadPromises);
    
    // Filter out null values (failed downloads)
    const successfulDownloads = downloadedPaths.filter((path): path is string => path !== null);
    
    console.log(`Successfully downloaded ${successfulDownloads.length} out of ${validUrls.length} images`);
    
    return successfulDownloads;
  } catch (error) {
    console.error('Error downloading multiple images:', error);
    return [];
  }
};

export const cleanupSharedImages = async (filePaths: string[]): Promise<void> => {
  try {
    if (!filePaths || filePaths.length === 0) {
      return;
    }

    console.log(`Cleaning up ${filePaths.length} shared images`);
    
    const deletePromises = filePaths.map(async (filePath) => {
      try {
        const exists = await RNFS.exists(filePath);
        if (exists) {
          await RNFS.unlink(filePath);
          console.log(`Deleted file: ${filePath}`);
        }
      } catch (error) {
        console.error(`Error deleting file ${filePath}:`, error);
      }
    });
    
    await Promise.all(deletePromises);
    console.log('Cleaned up shared images');
  } catch (error) {
    console.error('Error cleaning up shared images:', error);
  }
};

// Utility function to check if a URL is valid
export const isValidImageUrl = (url: string): boolean => {
  if (!url || typeof url !== 'string') {
    return false;
  }
  
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
  } catch {
    return false;
  }
};

// Function to create a fallback message with image URLs if file sharing fails
export const createFallbackShareMessage = (title: string, description: string, address: string, imageUrls: string[], mapsUrl?: string): string => {
  const baseMessage = `🏢 *${title}*\n\n📝 *Description:*\n${description}\n\n📍 *Location:*\n${address}`;
  
  const locationMessage = mapsUrl ? `${baseMessage}\n${mapsUrl}` : baseMessage;
  
  if (imageUrls && imageUrls.length > 0) {
    const imageUrlsText = imageUrls.map(url => url).join('\n\n');
    return `${locationMessage}\n\n🖼️ *Images:*\n${imageUrlsText}`;
  }
  
  return locationMessage;
};

// Function to test if a file exists and is accessible
export const testFileAccess = async (filePath: string): Promise<boolean> => {
  try {
    const exists = await RNFS.exists(filePath);
    if (exists) {
      const stats = await RNFS.stat(filePath);
      return stats.size > 0;
    }
    return false;
  } catch (error) {
    console.error('Error testing file access:', error);
    return false;
  }
};

// Function to get file info for debugging
export const getFileInfo = async (filePath: string): Promise<{ exists: boolean; size: number; path: string } | null> => {
  try {
    const exists = await RNFS.exists(filePath);
    if (exists) {
      const stats = await RNFS.stat(filePath);
      return {
        exists: true,
        size: stats.size,
        path: filePath
      };
    }
    return {
      exists: false,
      size: 0,
      path: filePath
    };
  } catch (error) {
    console.error('Error getting file info:', error);
    return null;
  }
}; 