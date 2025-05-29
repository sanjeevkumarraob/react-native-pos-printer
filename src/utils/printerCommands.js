/**
 * Utility functions for printer commands
 */

/**
 * Convert text to ESC/POS command bytes
 * @param {string} text - Text to convert
 * @param {Object} options - Formatting options
 * @returns {Array<number>} - Command bytes
 */
export const textToCommands = (text, options = {}) => {
  const commands = [];
  
  // Default options
  const {
    alignment = 'left',
    fontSize = 1,
    bold = false,
    underline = false,
    italic = false,
    invert = false,
  } = options;
  
  // Initialize
  commands.push(0x1B, 0x40); // ESC @ - Initialize printer
  
  // Set alignment
  if (alignment === 'center') {
    commands.push(0x1B, 0x61, 0x01); // ESC a 1 - Center alignment
  } else if (alignment === 'right') {
    commands.push(0x1B, 0x61, 0x02); // ESC a 2 - Right alignment
  } else {
    commands.push(0x1B, 0x61, 0x00); // ESC a 0 - Left alignment
  }
  
  // Set font size
  const size = Math.max(1, Math.min(8, fontSize));
  commands.push(0x1D, 0x21, (size - 1)); // GS ! n - Character size
  
  // Set bold
  if (bold) {
    commands.push(0x1B, 0x45, 0x01); // ESC E 1 - Bold on
  } else {
    commands.push(0x1B, 0x45, 0x00); // ESC E 0 - Bold off
  }
  
  // Set underline
  if (underline) {
    commands.push(0x1B, 0x2D, 0x01); // ESC - 1 - Underline on
  } else {
    commands.push(0x1B, 0x2D, 0x00); // ESC - 0 - Underline off
  }
  
  // Set italic (not directly supported by ESC/POS, this is a placeholder)
  
  // Set inverted
  if (invert) {
    commands.push(0x1D, 0x42, 0x01); // GS B 1 - Reverse mode on
  } else {
    commands.push(0x1D, 0x42, 0x00); // GS B 0 - Reverse mode off
  }
  
  // Add text
  const textBytes = textToBytes(text);
  commands.push(...textBytes);
  
  // Add line feed
  commands.push(0x0A); // LF - Line feed
  
  return commands;
};

/**
 * Convert text to byte array
 * @param {string} text - Text to convert
 * @returns {Array<number>} - Byte array
 */
const textToBytes = (text) => {
  const bytes = [];
  for (let i = 0; i < text.length; i++) {
    bytes.push(text.charCodeAt(i));
  }
  return bytes;
};

/**
 * Generate barcode command bytes
 * @param {string} data - Barcode data
 * @param {string} type - Barcode type
 * @param {Object} options - Barcode options
 * @returns {Array<number>} - Command bytes
 */
export const barcodeToCommands = (data, type, options = {}) => {
  const commands = [];
  
  // Default options
  const {
    width = 2,
    height = 100,
    printText = true,
    alignment = 'center',
  } = options;
  
  // Initialize
  commands.push(0x1B, 0x40); // ESC @ - Initialize printer
  
  // Set alignment
  if (alignment === 'center') {
    commands.push(0x1B, 0x61, 0x01); // ESC a 1 - Center alignment
  } else if (alignment === 'right') {
    commands.push(0x1B, 0x61, 0x02); // ESC a 2 - Right alignment
  } else {
    commands.push(0x1B, 0x61, 0x00); // ESC a 0 - Left alignment
  }
  
  // Set barcode text position
  if (printText) {
    commands.push(0x1D, 0x48, 0x02); // GS H 2 - Print text below barcode
  } else {
    commands.push(0x1D, 0x48, 0x00); // GS H 0 - Do not print text
  }
  
  // Set barcode width
  const barcodeWidth = Math.max(1, Math.min(6, width));
  commands.push(0x1D, 0x77, barcodeWidth); // GS w n - Barcode width
  
  // Set barcode height
  const barcodeHeight = Math.max(1, Math.min(255, height));
  commands.push(0x1D, 0x68, barcodeHeight); // GS h n - Barcode height
  
  // Set barcode type and print
  let barcodeType = 0;
  switch (type) {
    case 'upc_a':
      barcodeType = 0;
      break;
    case 'upc_e':
      barcodeType = 1;
      break;
    case 'ean13':
    case 'jan13':
      barcodeType = 2;
      break;
    case 'ean8':
    case 'jan8':
      barcodeType = 3;
      break;
    case 'code39':
      barcodeType = 4;
      break;
    case 'itf':
      barcodeType = 5;
      break;
    case 'codabar':
      barcodeType = 6;
      break;
    case 'code93':
      barcodeType = 7;
      break;
    case 'code128':
      barcodeType = 8;
      break;
    default:
      barcodeType = 8; // Default to CODE128
  }
  
  // Print barcode
  commands.push(0x1D, 0x6B, barcodeType); // GS k n
  
  // Add barcode data
  const dataBytes = textToBytes(data);
  commands.push(dataBytes.length); // Length of data
  commands.push(...dataBytes); // Barcode data
  
  // Add line feed
  commands.push(0x0A); // LF - Line feed
  
  return commands;
};

/**
 * Generate QR code command bytes
 * @param {string} data - QR code data
 * @param {Object} options - QR code options
 * @returns {Array<number>} - Command bytes
 */
export const qrCodeToCommands = (data, options = {}) => {
  const commands = [];
  
  // Default options
  const {
    size = 6,
    errorCorrection = 1,
    alignment = 'center',
  } = options;
  
  // Initialize
  commands.push(0x1B, 0x40); // ESC @ - Initialize printer
  
  // Set alignment
  if (alignment === 'center') {
    commands.push(0x1B, 0x61, 0x01); // ESC a 1 - Center alignment
  } else if (alignment === 'right') {
    commands.push(0x1B, 0x61, 0x02); // ESC a 2 - Right alignment
  } else {
    commands.push(0x1B, 0x61, 0x00); // ESC a 0 - Left alignment
  }
  
  // QR Code: Select model
  commands.push(0x1D, 0x28, 0x6B, 0x04, 0x00, 0x31, 0x41, 0x32, 0x00); // GS ( k 4 0 49 65 50 0 - QR Code model 2
  
  // QR Code: Set size
  const qrSize = Math.max(1, Math.min(8, size));
  commands.push(0x1D, 0x28, 0x6B, 0x03, 0x00, 0x31, 0x43, qrSize); // GS ( k 3 0 49 67 n - QR Code size
  
  // QR Code: Set error correction level
  const ecLevel = Math.max(0, Math.min(3, errorCorrection));
  commands.push(0x1D, 0x28, 0x6B, 0x03, 0x00, 0x31, 0x45, ecLevel); // GS ( k 3 0 49 69 n - QR Code error correction level
  
  // QR Code: Store data
  const dataBytes = textToBytes(data);
  const dataLength = dataBytes.length + 3;
  const pL = dataLength % 256;
  const pH = Math.floor(dataLength / 256);
  
  commands.push(0x1D, 0x28, 0x6B, pL, pH, 0x31, 0x50, 0x30); // GS ( k pL pH 49 80 48 - QR Code store data
  commands.push(...dataBytes);
  
  // QR Code: Print
  commands.push(0x1D, 0x28, 0x6B, 0x03, 0x00, 0x31, 0x51, 0x30); // GS ( k 3 0 49 81 48 - QR Code print
  
  // Add line feed
  commands.push(0x0A); // LF - Line feed
  
  return commands;
};

/**
 * Generate paper cut command bytes
 * @param {string} cutType - Cut type (full or partial)
 * @returns {Array<number>} - Command bytes
 */
export const cutPaperCommands = (cutType = 'full') => {
  const commands = [];
  
  // Feed before cutting
  commands.push(0x1B, 0x64, 0x03); // ESC d 3 - Feed 3 lines
  
  // Cut paper
  if (cutType === 'partial') {
    commands.push(0x1D, 0x56, 0x01); // GS V 1 - Partial cut
  } else {
    commands.push(0x1D, 0x56, 0x00); // GS V 0 - Full cut
  }
  
  return commands;
};

/**
 * Generate paper feed command bytes
 * @param {number} lines - Number of lines to feed
 * @returns {Array<number>} - Command bytes
 */
export const feedPaperCommands = (lines = 1) => {
  const commands = [];
  
  // Feed lines
  const feedLines = Math.max(1, Math.min(255, lines));
  commands.push(0x1B, 0x64, feedLines); // ESC d n - Feed n lines
  
  return commands;
};

/**
 * Generate cash drawer open command bytes
 * @returns {Array<number>} - Command bytes
 */
export const openCashDrawerCommands = () => {
  const commands = [];
  
  // Open cash drawer
  commands.push(0x1B, 0x70, 0x00, 0x19, 0xFA); // ESC p 0 25 250 - Open cash drawer
  
  return commands;
};

export default {
  textToCommands,
  barcodeToCommands,
  qrCodeToCommands,
  cutPaperCommands,
  feedPaperCommands,
  openCashDrawerCommands
};
