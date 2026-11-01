import { describe, it, expect } from 'vitest';
import { FileTransferManager } from '../services/transfer/fileTransferManager';

describe('FileTransferManager Security and Integrity', () => {
  it('sanitizes dangerous filenames and prevents path traversal', () => {
    expect(FileTransferManager.sanitizeFilename('../../etc/passwd')).toBe('passwd');
    expect(FileTransferManager.sanitizeFilename('..\\..\\Windows\\System32\\cmd.exe')).toBe('cmd.exe');
    expect(FileTransferManager.sanitizeFilename('payload<test>:*?"|file.txt')).toBe('payload_test______file.txt');
    expect(FileTransferManager.sanitizeFilename('...')).toMatch(/^netrix_transfer_\d+\.dat$/);
    expect(FileTransferManager.sanitizeFilename('normal-document.pdf')).toBe('normal-document.pdf');
  });

  it('validates file size within 2 GB quota limits', () => {
    expect(FileTransferManager.validateFileSize(0).valid).toBe(false);
    expect(FileTransferManager.validateFileSize(-1).valid).toBe(false);
    expect(FileTransferManager.validateFileSize(1024 * 1024).valid).toBe(true); // 1 MB
    expect(FileTransferManager.validateFileSize(2 * 1024 * 1024 * 1024).valid).toBe(true); // 2 GB
    expect(FileTransferManager.validateFileSize(2.5 * 1024 * 1024 * 1024).valid).toBe(false); // 2.5 GB exceeds limit
  });

  it('splits buffers into 64KB chunks correctly', () => {
    const data = new Uint8Array(150 * 1024); // 150 KB
    const chunks = FileTransferManager.createChunks(data.buffer);
    // 64 + 64 + 22 = 150 KB -> 3 chunks
    expect(chunks.length).toBe(3);
    expect(chunks[0].byteLength).toBe(64 * 1024);
    expect(chunks[1].byteLength).toBe(64 * 1024);
    expect(chunks[2].byteLength).toBe(22 * 1024);
  });

  it('computes verifiable SHA-256 cryptographic checksums', async () => {
    const encoder = new TextEncoder();
    const data = encoder.encode('NETRIX Secure Transfer Verification');
    const checksum = await FileTransferManager.computeChecksum(data.buffer);
    expect(checksum).toBeDefined();
    expect(checksum.length).toBe(64); // SHA-256 hex string is 64 characters
  });
});
