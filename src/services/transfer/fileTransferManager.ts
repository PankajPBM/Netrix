/**
 * NETRIX Secure File Transfer & Integrity Verification Manager
 * Encrypted chunked peer-to-peer file transfer over WebRTC DataChannel
 * Features: Path traversal prevention, SHA-256 chunk integrity, size limits, and audit tracking
 */

export interface FileTransferMetadata {
  transferId: string;
  name: string;
  size: number;
  mimeType: string;
  totalChunks: number;
  checksum: string;
}

export interface FileTransferProgress {
  transferId: string;
  bytesTransferred: number;
  totalBytes: number;
  percentage: number;
  speedMbps: number;
  status: 'pending' | 'transferring' | 'verifying' | 'completed' | 'failed' | 'cancelled';
  error?: string;
}

const CHUNK_SIZE = 64 * 1024; // 64 KB chunks for optimal WebRTC throughput
const MAX_FILE_SIZE_BYTES = 2 * 1024 * 1024 * 1024; // 2 GB Maximum

export class FileTransferManager {
  /**
   * Sanitize incoming filenames to prevent path traversal, command injection, and system overwrites
   */
  public static sanitizeFilename(filename: string): string {
    // 1. Strip path navigation characters
    let clean = filename.replace(/^.*[\\/]/, '');
    clean = clean.replace(/(\.\.[\/\\])+/g, '');
    // 2. Remove illegal characters on Windows / POSIX
    clean = clean.replace(/[<>:"/\\|?*\x00-\x1F]/g, '_');
    // 3. Prevent hidden system files or empty names
    clean = clean.replace(/^\.+/, '');
    if (!clean.trim()) {
      clean = `netrix_transfer_${Date.now()}.dat`;
    }
    return clean;
  }

  /**
   * Compute SHA-256 cryptographic checksum of ArrayBuffer or File
   */
  public static async computeChecksum(data: ArrayBuffer): Promise<string> {
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(hashBuffer))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
  }

  /**
   * Validate file size against organizational quota limits
   */
  public static validateFileSize(size: number): { valid: boolean; error?: string } {
    if (size <= 0) {
      return { valid: false, error: 'Empty file cannot be transferred.' };
    }
    if (size > MAX_FILE_SIZE_BYTES) {
      return {
        valid: false,
        error: `File size exceeds the 2 GB enterprise security transfer limit. (Requested: ${(size / (1024 * 1024)).toFixed(1)} MB)`,
      };
    }
    return { valid: true };
  }

  /**
   * Slice file into verifiable chunks
   */
  public static createChunks(fileData: ArrayBuffer): ArrayBuffer[] {
    const chunks: ArrayBuffer[] = [];
    let offset = 0;
    while (offset < fileData.byteLength) {
      const end = Math.min(offset + CHUNK_SIZE, fileData.byteLength);
      chunks.push(fileData.slice(offset, end));
      offset = end;
    }
    return chunks;
  }
}

