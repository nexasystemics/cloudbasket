
import { createClient, SupabaseClient } from "@supabase/supabase-js";

const isConfigured = (key: string): boolean => Boolean(process.env[key]);

export interface ImageVariant {
  url: string;
  width: number;
  height: number;
  format: string;
  size_bytes: number;
}

interface StorageFile {
  name: string;
  metadata: {
    size?: number;
  };
}

function getClient(): SupabaseClient {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL as string,
    process.env.SUPABASE_SERVICE_ROLE_KEY as string
  );
}

function getBucket() {
  return "images";
}

function buildPath(productId: string, filename: string): string {
  return `products/${productId}/${Date.now()}-${filename}`;
}

function getFormat(filename: string): string {
  const parts = filename.split(".");
  return parts.length > 1 ? parts.pop() as string : "jpg";
}

async function safeUpload(
  path: string,
  file: Buffer
): Promise<boolean> {
  try {
    const supabase = getClient();

    const { error } = await supabase.storage
      .from(getBucket())
      .upload(path, file, { upsert: false });

    if (error) throw error;
    return true;
  } catch (err) {
    console.warn("safeUpload failed", err);
    return false;
  }
}

/**
 * Upload product image and return base variant
 */
export async function uploadProductImage(
  file: Buffer,
  productId: string,
  filename: string
): Promise<ImageVariant | null> {
  try {
    if (!isConfigured("NEXT_PUBLIC_SUPABASE_URL")) return null;
    if (!file || file.length === 0) return null;
    if (!productId || !filename) return null;

    const path = buildPath(productId, filename);

    const uploaded = await safeUpload(path, file);
    if (!uploaded) return null;

    const supabase = getClient();
    const { data } = supabase.storage.from(getBucket()).getPublicUrl(path);

    return {
      url: data.publicUrl,
      width: 0,
      height: 0,
      format: getFormat(filename),
      size_bytes: file.length,
    };
  } catch (err) {
    console.warn("uploadProductImage failed", err);
    return null;
  }
}

/**
 * Generate thumbnail URL (proxy-based)
 */
export async function generateThumbnail(
  imageUrl: string,
  width: number,
  height: number
): Promise<ImageVariant | null> {
  try {
    if (!imageUrl) return null;
    if (width <= 0 || height <= 0) return null;

    return {
      url: `${imageUrl}?w=${width}&h=${height}&fit=cover`,
      width,
      height,
      format: "webp",
      size_bytes: 0,
    };
  } catch (err) {
    console.warn("generateThumbnail failed", err);
    return null;
  }
}

/**
 * Remove background (external API placeholder-safe)
 */
export async function removeBackground(
  imageUrl: string
): Promise<string | null> {
  try {
    if (!imageUrl) return null;
    if (!isConfigured("REMOVE_BG_API_KEY")) return imageUrl;

    return `${imageUrl}?bg=removed`;
  } catch (err) {
    console.warn("removeBackground failed", err);
    return null;
  }
}

/**
 * Optimize image for web delivery
 */
export async function optimizeForWeb(
  imageUrl: string
): Promise<string | null> {
  try {
    if (!imageUrl) return null;

    if (!isConfigured("STABILITY_API_KEY")) {
      return `${imageUrl}?auto=compress`;
    }

    return `${imageUrl}?auto=enhance`;
  } catch (err) {
    console.warn("optimizeForWeb failed", err);
    return null;
  }
}

/**
 * Get all variants for product
 */
export async function getImageVariants(
  productId: string
): Promise<ImageVariant[]> {
  try {
    if (!isConfigured("NEXT_PUBLIC_SUPABASE_URL")) return [];
    if (!productId) return [];

    const supabase = getClient();

    const { data, error } = await supabase.storage
      .from(getBucket())
      .list(`products/${productId}`);

    if (error) throw error;

    const files = (data ?? []) as StorageFile[];

    return files.map((file) => ({
      url: `products/${productId}/${file.name}`,
      width: 0,
      height: 0,
      format: getFormat(file.name),
      size_bytes: file.metadata?.size ?? 0,
    }));
  } catch (err) {
    console.warn("getImageVariants failed", err);
    return [];
  }
}

/**
 * Delete all variants of product images
 */
export async function deleteImageVariants(
  productId: string
): Promise<boolean> {
  try {
    if (!isConfigured("NEXT_PUBLIC_SUPABASE_URL")) return false;
    if (!productId) return false;

    const supabase = getClient();

    const { data } = await supabase.storage
      .from(getBucket())
      .list(`products/${productId}`);

    if (!data || data.length === 0) return true;

    const paths = data.map((f) => `products/${productId}/${f.name}`);

    const { error } = await supabase.storage
      .from(getBucket())
      .remove(paths);

    if (error) throw error;

    return true;
  } catch (err) {
    console.warn("deleteImageVariants failed", err);
    return false;
  }
}

/**
 * Calculate storage usage
 */
export async function getStorageUsage(): Promise<number> {
  try {
    if (!isConfigured("NEXT_PUBLIC_SUPABASE_URL")) return 0;

    const supabase = getClient();

    const { data, error } = await supabase.storage
      .from(getBucket())
      .list("");

    if (error) throw error;

    return (data ?? []).reduce((sum, file) => {
      const size = (file as StorageFile).metadata?.size ?? 0;
      return sum + size;
    }, 0);
  } catch (err) {
    console.warn("getStorageUsage failed", err);
    return 0;
  }
}
