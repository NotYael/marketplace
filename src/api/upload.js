/**
 * Upload API
 * RESTful service for file upload operations
 */

import supabase from "../lib/supabase";

/**
 * POST /api/upload - Upload image to storage
 * @param {File} file - Image file to upload
 * @param {Object} options - Upload options
 * @param {string} options.bucket - Storage bucket name (default: "listing-images")
 * @param {number} options.maxSize - Max file size in bytes (default: 5MB)
 * @returns {Promise<{data: {url: string, path: string}, error: null} | {data: null, error: string}>}
 */
export const uploadImage = async (
  file,
  { bucket = "listing-images", maxSize = 5 * 1024 * 1024 } = {}
) => {
  try {
    // Validate file exists
    if (!file) {
      throw new Error("No file provided");
    }

    // Validate file is an image
    if (!file.type.startsWith("image/")) {
      throw new Error("File must be an image");
    }

    // Validate file size
    if (file.size > maxSize) {
      const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(1);
      throw new Error(`Image size must be less than ${maxSizeMB}MB`);
    }

    // Supported image formats
    const supportedFormats = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    if (!supportedFormats.includes(file.type)) {
      throw new Error(
        "Unsupported image format. Supported formats: JPEG, PNG, GIF, WebP"
      );
    }

    // Generate unique filename
    const fileExt = file.name.split(".").pop().toLowerCase();
    const fileName = `${Math.random()
      .toString(36)
      .substring(2)}_${Date.now()}.${fileExt}`;
    const filePath = fileName;

    // Upload to Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: "3600", // Cache for 1 hour
        upsert: false, // Don't overwrite existing files
      });

    if (uploadError) {
      throw uploadError;
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from(bucket).getPublicUrl(filePath);

    return {
      data: {
        url: publicUrl,
        path: filePath,
      },
      error: null,
    };
  } catch (error) {
    console.error("Error uploading image:", error);
    return {
      data: null,
      error: error.message || "Failed to upload image",
    };
  }
};

/**
 * POST /api/upload/multiple - Upload multiple images
 * @param {FileList|Array<File>} files - Array of image files
 * @param {Object} options - Upload options
 * @returns {Promise<{data: Array<{url: string, path: string}>, error: null} | {data: null, error: string}>}
 */
export const uploadMultipleImages = async (files, options = {}) => {
  try {
    if (!files || files.length === 0) {
      throw new Error("No files provided");
    }

    // Convert FileList to Array if needed
    const fileArray = Array.from(files);

    // Upload all files
    const uploadPromises = fileArray.map((file) => uploadImage(file, options));
    const results = await Promise.all(uploadPromises);

    // Check if any uploads failed
    const failedUploads = results.filter((result) => result.error);
    if (failedUploads.length > 0) {
      throw new Error(
        `${failedUploads.length} file(s) failed to upload: ${failedUploads[0].error}`
      );
    }

    return {
      data: results.map((result) => result.data),
      error: null,
    };
  } catch (error) {
    console.error("Error uploading multiple images:", error);
    return {
      data: null,
      error: error.message || "Failed to upload images",
    };
  }
};

/**
 * DELETE /api/upload/:path - Delete uploaded image
 * @param {string} path - File path in storage
 * @param {string} bucket - Storage bucket name (default: "listing-images")
 * @returns {Promise<{data: boolean, error: null} | {data: null, error: string}>}
 */
export const deleteImage = async (path, bucket = "listing-images") => {
  try {
    if (!path) {
      throw new Error("File path is required");
    }

    const { error } = await supabase.storage.from(bucket).remove([path]);

    if (error) {
      throw error;
    }

    return {
      data: true,
      error: null,
    };
  } catch (error) {
    console.error("Error deleting image:", error);
    return {
      data: null,
      error: error.message || "Failed to delete image",
    };
  }
};

/**
 * GET /api/upload/url/:path - Get public URL for uploaded image
 * @param {string} path - File path in storage
 * @param {string} bucket - Storage bucket name (default: "listing-images")
 * @returns {Promise<{data: {url: string}, error: null} | {data: null, error: string}>}
 */
export const getImageUrl = async (path, bucket = "listing-images") => {
  try {
    if (!path) {
      throw new Error("File path is required");
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from(bucket).getPublicUrl(path);

    return {
      data: {
        url: publicUrl,
      },
      error: null,
    };
  } catch (error) {
    console.error("Error getting image URL:", error);
    return {
      data: null,
      error: error.message || "Failed to get image URL",
    };
  }
};
