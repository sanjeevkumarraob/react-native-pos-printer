# React Native POS Printer

A React Native module for ESC/POS thermal printers supporting both iOS and Android platforms.

## Features

- Cross-platform support (iOS and Android)
- Multiple connection types (USB, Bluetooth, Network)
- Text printing with formatting options
- Image printing
- Barcode and QR code printing
- Receipt templates
- Paper control (cut, feed)
- Cash drawer control
- Raw command support

## Installation

```bash
npm install react-native-pos-printer --save
# or
yarn add react-native-pos-printer
```

### iOS Setup

1. Add the following to your Podfile:

```ruby
pod 'react-native-pos-printer', :path => '../node_modules/react-native-pos-printer'
```

2. Run pod install:

```bash
cd ios && pod install
```

3. Add the following to your Info.plist:

```xml
<key>UISupportedExternalAccessoryProtocols</key>
<array>
    <string>com.epson.escpos</string>
</array>
```

4. Add the ExternalAccessory framework to your project.

### Android Setup

1. Add the following to your `android/settings.gradle`:

```gradle
include ':react-native-pos-printer'
project(':react-native-pos-printer').projectDir = new File(rootProject.projectDir, '../node_modules/react-native-pos-printer/android')
```

2. Add the following to your `android/app/build.gradle`:

```gradle
dependencies {
    // ...
    implementation project(':react-native-pos-printer')
}
```

3. Add the following to your `MainApplication.java`:

```java
import com.reactnativeposprinter.PosPrinterPackage;

// ...

@Override
protected List<ReactPackage> getPackages() {
    return Arrays.<ReactPackage>asList(
        new MainReactPackage(),
        // ...
        new PosPrinterPackage()
    );
}
```

4. Add the following permissions to your `AndroidManifest.xml`:

```xml
<uses-permission android:name="android.permission.BLUETOOTH" />
<uses-permission android:name="android.permission.BLUETOOTH_ADMIN" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
<uses-feature android:name="android.hardware.usb.host" />
```

## Usage

```javascript
import PosPrinter, { PrinterConnectionType, TextAlignment } from 'react-native-pos-printer';

// Discover printers
const discoverPrinters = async () => {
  try {
    const printers = await PosPrinter.getAvailablePrinters(PrinterConnectionType.ALL);
    console.log('Available printers:', printers);
    return printers;
  } catch (error) {
    console.error('Error discovering printers:', error);
    return [];
  }
};

// Connect to a printer
const connectToPrinter = async (printer) => {
  try {
    const connectedPrinter = await PosPrinter.connectToPrinter(printer);
    console.log('Connected to printer:', connectedPrinter);
    return true;
  } catch (error) {
    console.error('Error connecting to printer:', error);
    return false;
  }
};

// Print text
const printText = async () => {
  try {
    await PosPrinter.printText('Hello, World!', {
      alignment: TextAlignment.CENTER,
      fontSize: 2,
      bold: true
    });
    return true;
  } catch (error) {
    console.error('Error printing text:', error);
    return false;
  }
};

// Print image
const printImage = async (imageUri) => {
  try {
    await PosPrinter.printImage(imageUri, {
      width: 300,
      alignment: TextAlignment.CENTER
    });
    return true;
  } catch (error) {
    console.error('Error printing image:', error);
    return false;
  }
};

// Print barcode
const printBarcode = async () => {
  try {
    await PosPrinter.printBarcode('1234567890', 'code128', {
      width: 2,
      height: 100,
      printText: true
    });
    return true;
  } catch (error) {
    console.error('Error printing barcode:', error);
    return false;
  }
};

// Print QR code
const printQRCode = async () => {
  try {
    await PosPrinter.printQRCode('https://example.com', {
      size: 6,
      errorCorrection: 1
    });
    return true;
  } catch (error) {
    console.error('Error printing QR code:', error);
    return false;
  }
};

// Print complete receipt
const printReceipt = async () => {
  try {
    const receipt = {
      items: [
        {
          type: 'text',
          data: 'RECEIPT',
          options: {
            alignment: TextAlignment.CENTER,
            fontSize: 2,
            bold: true
          }
        },
        {
          type: 'text',
          data: '--------------------------------',
          options: {
            alignment: TextAlignment.CENTER
          }
        },
        {
          type: 'text',
          data: 'Item 1                    $10.00',
          options: {
            alignment: TextAlignment.LEFT
          }
        },
        {
          type: 'text',
          data: 'Item 2                     $5.00',
          options: {
            alignment: TextAlignment.LEFT
          }
        },
        {
          type: 'text',
          data: '--------------------------------',
          options: {
            alignment: TextAlignment.CENTER
          }
        },
        {
          type: 'text',
          data: 'TOTAL                     $15.00',
          options: {
            alignment: TextAlignment.LEFT,
            bold: true
          }
        },
        {
          type: 'text',
          data: 'Thank you for your purchase!',
          options: {
            alignment: TextAlignment.CENTER
          }
        },
        {
          type: 'qrcode',
          data: 'https://example.com/receipt/123',
          options: {
            alignment: TextAlignment.CENTER,
            size: 6
          }
        }
      ],
      cutPaper: true,
      feedLines: 3
    };
    
    await PosPrinter.printReceipt(receipt);
    return true;
  } catch (error) {
    console.error('Error printing receipt:', error);
    return false;
  }
};

// Cut paper
const cutPaper = async () => {
  try {
    await PosPrinter.cutPaper('full');
    return true;
  } catch (error) {
    console.error('Error cutting paper:', error);
    return false;
  }
};

// Open cash drawer
const openCashDrawer = async () => {
  try {
    await PosPrinter.openCashDrawer();
    return true;
  } catch (error) {
    console.error('Error opening cash drawer:', error);
    return false;
  }
};
```

## API Reference

### PosPrinter

#### Methods

- `getAvailablePrinters(type)` - Get available printers by type
- `connectToPrinter(printerInfo)` - Connect to a specific printer
- `disconnectPrinter()` - Disconnect from the current printer
- `getCurrentPrinter()` - Get currently connected printer information
- `getPrinterStatus()` - Get current printer status
- `printText(text, options)` - Print text with formatting options
- `printImage(imageUri, options)` - Print image from URI
- `printReceipt(receiptData)` - Print complete receipt (text + images)
- `printBarcode(data, type, options)` - Print barcode
- `printQRCode(data, options)` - Print QR code
- `cutPaper(cutType)` - Cut paper
- `feedPaper(lines)` - Feed paper by number of lines
- `sendCommand(command)` - Send raw ESC/POS command
- `openCashDrawer()` - Open connected cash drawer

### Constants

#### PrinterConnectionType

- `USB` - USB connection
- `BLUETOOTH` - Bluetooth connection
- `NETWORK` - Network connection
- `ALL` - All connection types

#### PrinterStatus

- `CONNECTED` - Printer is connected
- `DISCONNECTED` - Printer is disconnected
- `PAPER_EMPTY` - Printer is out of paper
- `COVER_OPEN` - Printer cover is open
- `PRINTER_ERROR` - Printer has an error

#### BarcodeType

- `UPC_A` - UPC-A barcode
- `UPC_E` - UPC-E barcode
- `EAN13` - EAN-13 barcode
- `JAN13` - JAN-13 barcode
- `EAN8` - EAN-8 barcode
- `JAN8` - JAN-8 barcode
- `CODE39` - Code 39 barcode
- `ITF` - ITF barcode
- `CODABAR` - Codabar barcode
- `CODE93` - Code 93 barcode
- `CODE128` - Code 128 barcode
- `GS1_128` - GS1-128 barcode
- `GS1_DATABAR_OMNIDIRECTIONAL` - GS1 DataBar Omnidirectional barcode
- `GS1_DATABAR_TRUNCATED` - GS1 DataBar Truncated barcode
- `GS1_DATABAR_LIMITED` - GS1 DataBar Limited barcode
- `GS1_DATABAR_EXPANDED` - GS1 DataBar Expanded barcode

#### TextAlignment

- `LEFT` - Left alignment
- `CENTER` - Center alignment
- `RIGHT` - Right alignment

#### CutPaperType

- `FULL` - Full cut
- `PARTIAL` - Partial cut

### Event Listeners

- `PrinterEvents.addPrinterStatusListener(callback)` - Add printer status listener
- `PrinterEvents.addPrinterConnectionListener(callback)` - Add printer connection listener
- `PrinterEvents.removePrinterStatusListener(listenerId)` - Remove printer status listener
- `PrinterEvents.removePrinterConnectionListener(listenerId)` - Remove printer connection listener

## License

MIT
