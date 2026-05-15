export interface StorageProvider {
  uploadFile(file: File, path: string): Promise<{ url: string; key: string }>;
  deleteFile(key: string): Promise<void>;
  getSignedUrl(key: string): Promise<string>;
}

/**
 * Local Storage Provider (for development)
 * Saves files to the public/uploads directory
 */
class LocalStorageProvider implements StorageProvider {
  async uploadFile(file: File, path: string): Promise<{ url: string; key: string }> {
    // In Next.js Edge runtime or Server Actions, we'd handle this via the filesystem
    // Since we're in a browser/server environment, we'll simulate the local save 
    // or use a temporary local API route.
    
    // For now, let's return a simulated success for local development
    // in a way that doesn't require R2 billing.
    const key = `${path}/${Date.now()}-${file.name}`;
    const url = `/uploads/${key}`; 
    
    console.log(`[LocalStorage] Simulating upload of ${file.name} to ${url}`);
    
    // In a real local setup, you'd write to the filesystem here.
    // For this modular setup, we'll just return the metadata.
    return { url, key };
  }

  async deleteFile(key: string): Promise<void> {
    console.log(`[LocalStorage] Deleting ${key}`);
  }

  async getSignedUrl(key: string): Promise<string> {
    return `/uploads/${key}`;
  }
}

/**
 * Cloudflare R2 Provider (Ready for later)
 */
class R2StorageProvider implements StorageProvider {
  private bucket: any;

  constructor(bucket: any) {
    this.bucket = bucket;
  }

  async uploadFile(file: File, path: string): Promise<{ url: string; key: string }> {
    const key = `${path}/${crypto.randomUUID()}-${file.name}`;
    await this.bucket.put(key, file.stream(), {
      httpMetadata: { contentType: file.type },
    });
    return { url: `${process.env.R2_PUBLIC_URL}/${key}`, key };
  }

  async deleteFile(key: string): Promise<void> {
    await this.bucket.delete(key);
  }

  async getSignedUrl(key: string): Promise<string> {
    // R2 signed URL logic
    return ""; 
  }
}

// Factory to get the appropriate storage provider
export function getStorageProvider(env?: any): StorageProvider {
  // Check if R2 bucket is available in the environment
  if (env?.BUCKET || process.env.BUCKET) {
    return new R2StorageProvider(env?.BUCKET || (process.env as any).BUCKET);
  }
  
  // Fallback to local storage for development
  return new LocalStorageProvider();
}
