/**
 * NETRIX Secure Clipboard Synchronization Manager
 * Encrypted remote clipboard bridge with size quotas and memory protection
 */

const MAX_CLIPBOARD_TEXT_BYTES = 1024 * 1024; // 1 MB quota

export class ClipboardManager {
  /**
   * Safely read text from system clipboard
   */
  public static async readLocalClipboard(): Promise<string | null> {
    try {
      if (navigator.clipboard && navigator.clipboard.readText) {
        const text = await navigator.clipboard.readText();
        if (text && text.length <= MAX_CLIPBOARD_TEXT_BYTES) {
          return text;
        }
      }
      return null;
    } catch {
      return null;
    }
  }

  /**
   * Safely write received text to system clipboard
   */
  public static async writeLocalClipboard(text: string): Promise<boolean> {
    try {
      if (!text || text.length > MAX_CLIPBOARD_TEXT_BYTES) return false;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(text);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }
}

