/**
 * Type definitions for react-native-pos-printer
 */

/**
 * @typedef {Object} PrinterInfo
 * @property {string} id - Unique identifier for the printer
 * @property {string} name - Printer name
 * @property {string} model - Printer model
 * @property {string} type - Connection type (usb, bluetooth, network)
 * @property {string} address - Printer address (MAC address, IP address, etc.)
 * @property {boolean} isConnected - Whether the printer is currently connected
 */

/**
 * @typedef {Object} PrinterStatus
 * @property {boolean} isConnected - Whether the printer is connected
 * @property {boolean} isPaperEmpty - Whether the printer is out of paper
 * @property {boolean} isCoverOpen - Whether the printer cover is open
 * @property {boolean} isError - Whether the printer has an error
 * @property {string} errorMessage - Error message if any
 */

/**
 * @typedef {Object} TextPrintOptions
 * @property {string} alignment - Text alignment (left, center, right)
 * @property {number} fontSize - Font size (1-8)
 * @property {boolean} bold - Whether to print bold text
 * @property {boolean} underline - Whether to underline text
 * @property {boolean} italic - Whether to print italic text
 * @property {boolean} invert - Whether to invert text colors
 */

/**
 * @typedef {Object} ImagePrintOptions
 * @property {string} alignment - Image alignment (left, center, right)
 * @property {number} width - Image width in pixels
 * @property {number} height - Image height in pixels
 * @property {boolean} dithering - Whether to apply dithering
 */

/**
 * @typedef {Object} BarcodePrintOptions
 * @property {string} alignment - Barcode alignment (left, center, right)
 * @property {number} width - Barcode width (1-6)
 * @property {number} height - Barcode height in dots
 * @property {boolean} printText - Whether to print text below barcode
 */

/**
 * @typedef {Object} QRCodePrintOptions
 * @property {string} alignment - QR code alignment (left, center, right)
 * @property {number} size - QR code size (1-8)
 * @property {number} errorCorrection - Error correction level (0-3)
 */

/**
 * @typedef {Object} ReceiptItem
 * @property {string} type - Item type (text, image, barcode, qrcode, command)
 * @property {string|Object} data - Item data
 * @property {Object} options - Item options
 */

/**
 * @typedef {Object} ReceiptData
 * @property {Array<ReceiptItem>} items - Receipt items
 * @property {boolean} cutPaper - Whether to cut paper after printing
 * @property {number} feedLines - Number of lines to feed after printing
 */

export default {};
