import { supabase } from "../lib/SupabaseClient";

/**
 * Compress an image file using canvas.
 * Resizes to max 1200px on longest side and compresses to JPEG.
 * @param {File} file - The original image file
 * @param {number} [maxSize=1200] - Max dimension in pixels
 * @param {number} [quality=0.8] - JPEG quality (0-1)
 * @returns {Promise<Blob>} Compressed image blob
 */
export async function compressImage(file, maxSize = 1200, quality = 0.8) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    img.onload = () => {
      let { width, height } = img;

      // Scale down if needed
      if (width > maxSize || height > maxSize) {
        const ratio = Math.min(maxSize / width, maxSize / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }

      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error("Failed to compress image"));
          }
        },
        "image/jpeg",
        quality
      );
    };

    img.onerror = () => reject(new Error("Failed to load image for compression"));
    img.src = URL.createObjectURL(file);
  });
}

/**
 * Convert a File or Blob to a base64 data string (without the prefix).
 * @param {File|Blob} file
 * @returns {Promise<string>} Base64-encoded string
 */
export function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      // Remove the "data:image/jpeg;base64," prefix
      const base64 = reader.result.split(",")[1];
      resolve(base64);
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}

/**
 * Upload a photo to Supabase Storage and return the public URL.
 * @param {File|Blob} file - The image file to upload
 * @param {string} [fileName] - Optional custom filename
 * @returns {Promise<string>} Public URL of the uploaded image
 */
export async function uploadHazardPhoto(file, fileName) {
  // Generate a unique filename
  const ext = file.type === "image/png" ? "png" : "jpg";
  const name = fileName || `hazard_${Date.now()}_${Math.random().toString(36).slice(2, 8)}.${ext}`;

  const { data, error } = await supabase.storage
    .from("hazard-photos")
    .upload(name, file, {
      contentType: file.type || "image/jpeg",
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    throw new Error(`Photo upload failed: ${error.message}`);
  }

  // Get the public URL
  const { data: urlData } = supabase.storage
    .from("hazard-photos")
    .getPublicUrl(data.path);

  return urlData.publicUrl;
}

/**
 * Validate an image file before upload.
 * @param {File} file
 * @returns {{ valid: boolean, error?: string }}
 */
export function validateImageFile(file) {
  const MAX_SIZE = 10 * 1024 * 1024; // 10MB before compression
  const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/heic"];

  if (!file) {
    return { valid: false, error: "No file selected." };
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return { valid: false, error: "Please upload a JPEG, PNG, or WebP image." };
  }

  if (file.size > MAX_SIZE) {
    return { valid: false, error: "Image is too large (max 10MB)." };
  }

  return { valid: true };
}
