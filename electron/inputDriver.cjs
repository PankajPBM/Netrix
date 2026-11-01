/**
 * NETRIX Native Input Injection Driver (Win32 User32)
 * High-speed Mouse and Keyboard event injection via koffi FFI
 */

let user32 = null;
let mouse_event = null;
let keybd_event = null;
let SetCursorPos = null;

try {
  const koffi = require('koffi');
  user32 = koffi.load('user32.dll');

  // Win32 API functions
  SetCursorPos = user32.func('bool __stdcall SetCursorPos(int X, int Y)');
  mouse_event = user32.func('void __stdcall mouse_event(uint32 dwFlags, uint32 dx, uint32 dy, uint32 dwData, uintptr_t dwExtraInfo)');
  keybd_event = user32.func('void __stdcall keybd_event(uint8 bVk, uint8 bScan, uint32 dwFlags, uintptr_t dwExtraInfo)');
} catch (e) {
  console.warn('[NETRIX Input Driver] Native user32 injection unavailable, running in fallback mode:', e.message);
}

// Mouse Event Flags
const MOUSEEVENTF_MOVE = 0x0001;
const MOUSEEVENTF_LEFTDOWN = 0x0002;
const MOUSEEVENTF_LEFTUP = 0x0004;
const MOUSEEVENTF_RIGHTDOWN = 0x0008;
const MOUSEEVENTF_RIGHTUP = 0x0010;
const MOUSEEVENTF_MIDDLEDOWN = 0x0020;
const MOUSEEVENTF_MIDDLEUP = 0x0040;
const MOUSEEVENTF_WHEEL = 0x0800;

// Keyboard Event Flags
const KEYEVENTF_EXTENDEDKEY = 0x0001;
const KEYEVENTF_KEYUP = 0x0002;

class InputDriver {
  /**
   * Move mouse cursor to screen coordinates
   * @param {number} x Screen X
   * @param {number} y Screen Y
   */
  static setCursorPos(x, y) {
    if (SetCursorPos) {
      SetCursorPos(Math.round(x), Math.round(y));
    }
  }

  /**
   * Inject mouse button actions
   * @param {'mousedown'|'mouseup'|'wheel'} type 
   * @param {number} button 0 = Left, 1 = Middle, 2 = Right
   * @param {number} delta Wheel delta
   */
  static mouseAction(type, button = 0, delta = 0) {
    if (!mouse_event) return;

    if (type === 'mousedown') {
      if (button === 0) mouse_event(MOUSEEVENTF_LEFTDOWN, 0, 0, 0, 0);
      else if (button === 1) mouse_event(MOUSEEVENTF_MIDDLEDOWN, 0, 0, 0, 0);
      else if (button === 2) mouse_event(MOUSEEVENTF_RIGHTDOWN, 0, 0, 0, 0);
    } else if (type === 'mouseup') {
      if (button === 0) mouse_event(MOUSEEVENTF_LEFTUP, 0, 0, 0, 0);
      else if (button === 1) mouse_event(MOUSEEVENTF_MIDDLEUP, 0, 0, 0, 0);
      else if (button === 2) mouse_event(MOUSEEVENTF_RIGHTUP, 0, 0, 0, 0);
    } else if (type === 'wheel') {
      mouse_event(MOUSEEVENTF_WHEEL, 0, 0, Math.round(delta * 120), 0);
    }
  }

  /**
   * Inject keyboard event
   * @param {'keydown'|'keyup'} type 
   * @param {number} keyCode Windows Virtual Key Code (VK)
   */
  static keyboardAction(type, keyCode) {
    if (!keybd_event) return;
    const flags = type === 'keyup' ? KEYEVENTF_KEYUP : 0;
    keybd_event(keyCode & 0xFF, 0, flags, 0);
  }
}

module.exports = InputDriver;
