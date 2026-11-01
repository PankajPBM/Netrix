/**
 * NETRIX Real-Time Screen Capture Driver
 * Captures Windows Desktop via Electron desktopCapturer with 60 FPS hardware acceleration
 */
const { desktopCapturer } = require('electron');

class ScreenCaptureDriver {
  /**
   * Get available screen sources
   */
  static async getScreenSources() {
    const sources = await desktopCapturer.getSources({
      types: ['screen'],
      thumbnailSize: { width: 480, height: 270 },
      fetchWindowIcons: false,
    });

    return sources.map((s) => ({
      id: s.id,
      name: s.name,
      thumbnail: s.thumbnail.toDataURL(),
    }));
  }
}

module.exports = ScreenCaptureDriver;
