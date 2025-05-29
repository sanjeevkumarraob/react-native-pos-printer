/**
 * React Native POS Printer Module
 * A cross-platform module for interacting with ESC/POS thermal printers
 */

import { NativeModules, NativeEventEmitter, Platform } from 'react-native';

const { PosPrinterModule } = NativeModules;

// Fix for "Invariant Violation: `new NativeEventEmitter()` requires a non-null argument"
// Check if the native module exists before creating the event emitter
let printerEventEmitter;
if (PosPrinterModule) {
  printerEventEmitter = new NativeEventEmitter(PosPrinterModule);
} else {
  console.warn('PosPrinterModule is not available. Event listeners will not work.');
  // Create a mock event emitter to prevent crashes
  printerEventEmitter = {
    addListener: () => ({ remove: () => {}, listenerCount: -1 }),
    removeListener: () => {},
  };
}

/**
 * Printer connection types
 */
export const PrinterConnectionType = {
  USB: 'usb',
  BLUETOOTH: 'bluetooth',
  NETWORK: 'network',
  ALL: 'all'
};

/**
 * Printer status codes
 */
export const PrinterStatus = {
  CONNECTED: 'connected',
  DISCONNECTED: 'disconnected',
  PAPER_EMPTY: 'paper_empty',
  COVER_OPEN: 'cover_open',
  PRINTER_ERROR: 'printer_error'
};

/**
 * Barcode types
 */
export const BarcodeType = {
  UPC_A: 'upc_a',
  UPC_E: 'upc_e',
  EAN13: 'ean13',
  JAN13: 'jan13',
  EAN8: 'ean8',
  JAN8: 'jan8',
  CODE39: 'code39',
  ITF: 'itf',
  CODABAR: 'codabar',
  CODE93: 'code93',
  CODE128: 'code128',
  GS1_128: 'gs1_128',
  GS1_DATABAR_OMNIDIRECTIONAL: 'gs1_databar_omnidirectional',
  GS1_DATABAR_TRUNCATED: 'gs1_databar_truncated',
  GS1_DATABAR_LIMITED: 'gs1_databar_limited',
  GS1_DATABAR_EXPANDED: 'gs1_databar_expanded'
};

/**
 * Text alignment options
 */
export const TextAlignment = {
  LEFT: 'left',
  CENTER: 'center',
  RIGHT: 'right'
};

/**
 * Cut paper types
 */
export const CutPaperType = {
  FULL: 'full',
  PARTIAL: 'partial'
};

// Create a safe wrapper for native module methods
const createSafeMethod = (methodName) => {
  return (...args) => {
    if (!PosPrinterModule || !PosPrinterModule[methodName]) {
      console.warn(`Method ${methodName} is not available in PosPrinterModule`);
      return Promise.reject(new Error(`Method ${methodName} is not available`));
    }
    return PosPrinterModule[methodName](...args);
  };
};

/**
 * Main PosPrinter class
 */
class PosPrinter {
  /**
   * Get available printers by type
   * @param {string} type - Printer connection type (usb, bluetooth, network, all)
   * @returns {Promise<Array>} - Array of printer objects
   */
  static getAvailablePrinters(type = PrinterConnectionType.ALL) {
    return createSafeMethod('getAvailablePrinters')(type);
  }

  /**
   * Connect to a specific printer
   * @param {Object} printerInfo - Printer information object
   * @returns {Promise<Object>} - Connected printer information
   */
  static connectToPrinter(printerInfo) {
    return createSafeMethod('connectToPrinter')(printerInfo);
  }

  /**
   * Disconnect from the current printer
   * @returns {Promise<boolean>} - Success status
   */
  static disconnectPrinter() {
    return createSafeMethod('disconnectPrinter')();
  }

  /**
   * Get currently connected printer information
   * @returns {Promise<Object|null>} - Connected printer information or null
   */
  static getCurrentPrinter() {
    return createSafeMethod('getCurrentPrinter')();
  }

  /**
   * Get current printer status
   * @returns {Promise<Object>} - Printer status object
   */
  static getPrinterStatus() {
    return createSafeMethod('getPrinterStatus')();
  }

  /**
   * Print text with formatting options
   * @param {string} text - Text to print
   * @param {Object} options - Formatting options
   * @returns {Promise<boolean>} - Success status
   */
  static printText(text, options = {}) {
    return createSafeMethod('printText')(text, options);
  }

  /**
   * Print image from URI
   * @param {string} imageUri - Image URI (file path or base64)
   * @param {Object} options - Image printing options
   * @returns {Promise<boolean>} - Success status
   */
  static printImage(imageUri, options = {}) {
    return createSafeMethod('printImage')(imageUri, options);
  }

  /**
   * Print complete receipt (text + images)
   * @param {Object} receiptData - Receipt data object
   * @returns {Promise<boolean>} - Success status
   */
  static printReceipt(receiptData) {
    return createSafeMethod('printReceipt')(receiptData);
  }

  /**
   * Print barcode
   * @param {string} data - Barcode data
   * @param {string} type - Barcode type
   * @param {Object} options - Barcode options
   * @returns {Promise<boolean>} - Success status
   */
  static printBarcode(data, type, options = {}) {
    return createSafeMethod('printBarcode')(data, type, options);
  }

  /**
   * Print QR code
   * @param {string} data - QR code data
   * @param {Object} options - QR code options
   * @returns {Promise<boolean>} - Success status
   */
  static printQRCode(data, options = {}) {
    return createSafeMethod('printQRCode')(data, options);
  }

  /**
   * Cut paper
   * @param {string} cutType - Cut type (full or partial)
   * @returns {Promise<boolean>} - Success status
   */
  static cutPaper(cutType = CutPaperType.FULL) {
    return createSafeMethod('cutPaper')(cutType);
  }

  /**
   * Feed paper by number of lines
   * @param {number} lines - Number of lines to feed
   * @returns {Promise<boolean>} - Success status
   */
  static feedPaper(lines = 1) {
    return createSafeMethod('feedPaper')(lines);
  }

  /**
   * Send raw ESC/POS command
   * @param {string|Array<number>} command - Raw command as string or byte array
   * @returns {Promise<boolean>} - Success status
   */
  static sendCommand(command) {
    return createSafeMethod('sendCommand')(command);
  }

  /**
   * Open connected cash drawer
   * @returns {Promise<boolean>} - Success status
   */
  static openCashDrawer() {
    return createSafeMethod('openCashDrawer')();
  }
}

/**
 * Printer event listeners
 */
export const PrinterEvents = {
  /**
   * Add printer status listener
   * @param {Function} callback - Status change callback
   * @returns {string} - Listener ID
   */
  addPrinterStatusListener: (callback) => {
    if (!printerEventEmitter.addListener) {
      console.warn('Event listener functionality is not available');
      return -1;
    }
    return printerEventEmitter.addListener('printerStatusChanged', callback).listenerCount;
  },

  /**
   * Add printer connection listener
   * @param {Function} callback - Connection change callback
   * @returns {string} - Listener ID
   */
  addPrinterConnectionListener: (callback) => {
    if (!printerEventEmitter.addListener) {
      console.warn('Event listener functionality is not available');
      return -1;
    }
    return printerEventEmitter.addListener('printerConnectionChanged', callback).listenerCount;
  },

  /**
   * Remove printer status listener
   * @param {string} listenerId - Listener ID to remove
   */
  removePrinterStatusListener: (listenerId) => {
    if (printerEventEmitter.removeListener) {
      printerEventEmitter.removeListener('printerStatusChanged', listenerId);
    }
  },

  /**
   * Remove printer connection listener
   * @param {string} listenerId - Listener ID to remove
   */
  removePrinterConnectionListener: (listenerId) => {
    if (printerEventEmitter.removeListener) {
      printerEventEmitter.removeListener('printerConnectionChanged', listenerId);
    }
  }
};

export default PosPrinter;
