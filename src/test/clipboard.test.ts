import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ClipboardManager } from '../services/clipboard/clipboardManager';

describe('ClipboardManager Quota and Security', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('rejects oversized clipboard payloads exceeding 1 MB', async () => {
    const hugeText = 'A'.repeat(1024 * 1024 + 10);
    const writeResult = await ClipboardManager.writeLocalClipboard(hugeText);
    expect(writeResult).toBe(false);
  });

  it('rejects empty clipboard payload writes', async () => {
    const emptyResult = await ClipboardManager.writeLocalClipboard('');
    expect(emptyResult).toBe(false);
  });

  it('writes valid clipboard text when navigator.clipboard is available', async () => {
    const mockWriteText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, {
      clipboard: {
        writeText: mockWriteText,
      },
    });

    const success = await ClipboardManager.writeLocalClipboard('Netrix Connect Beyond Limits');
    expect(success).toBe(true);
    expect(mockWriteText).toHaveBeenCalledWith('Netrix Connect Beyond Limits');
  });

  it('reads clipboard text safely when available', async () => {
    const mockReadText = vi.fn().mockResolvedValue('Sample Clipboard Text');
    Object.assign(navigator, {
      clipboard: {
        readText: mockReadText,
      },
    });

    const text = await ClipboardManager.readLocalClipboard();
    expect(text).toBe('Sample Clipboard Text');
  });
});

