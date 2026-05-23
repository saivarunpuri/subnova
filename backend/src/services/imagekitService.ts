import ImageKit from 'imagekit';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY || '',
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY || '',
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT || '',
});

/**
 * Uploads a file buffer directly to ImageKit.io
 * @param fileBuffer Buffer containing the file data
 * @param fileName Name of the file with extension
 * @returns Promise resolving to the uploaded image's public CDN URL
 */
export const uploadToImageKit = async (fileBuffer: Buffer, fileName: string): Promise<string> => {
  try {
    if (!process.env.IMAGEKIT_PUBLIC_KEY || !process.env.IMAGEKIT_PRIVATE_KEY || !process.env.IMAGEKIT_URL_ENDPOINT) {
      throw new Error('ImageKit configuration keys are missing in the backend environment variables.');
    }

    // Generate a secure, unique filename to avoid duplicates/collisions in ImageKit
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const parsedFile = path.parse(fileName);
    const safeBaseName = parsedFile.name.replace(/[^a-zA-Z0-9_-]/g, '_');
    const formattedFileName = `${safeBaseName}-${uniqueSuffix}${parsedFile.ext}`;

    const response = await imagekit.upload({
      file: fileBuffer,
      fileName: formattedFileName,
      folder: '/ottbundle_uploads',
    });

    return response.url;
  } catch (error: any) {
    console.error('[ImageKit Service] Upload failed:', error);
    throw new Error(`ImageKit Upload failed: ${error.message || error}`);
  }
};
