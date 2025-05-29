# React Native POS Printer Module - Troubleshooting Guide

## Common Issues and Solutions

### 1. NativeEventEmitter Error

**Issue**: `Invariant Violation: 'new NativeEventEmitter()' requires a non-null argument., js engine: hermes`

**Solution**: 
This error occurs when the native module is not properly registered or available when the JavaScript code tries to create an event emitter. The module has been updated to handle this gracefully by checking if the native module exists before creating the event emitter.

**Steps to fix**:
1. Make sure the native module is properly linked
2. For iOS, run `pod install` in the iOS directory
3. For Android, ensure the package is added to `MainApplication.java`
4. Rebuild your app completely

### 2. Module Not Found

**Issue**: `Module 'PosPrinterModule' not found`

**Solution**:
This error occurs when the native module is not properly linked or registered.

**Steps to fix**:
- For iOS:
  1. Make sure `react-native-pos-printer` is added to your Podfile
  2. Run `pod install` in the iOS directory
  3. Clean build folder and rebuild

- For Android:
  1. Make sure the package is added to `settings.gradle`
  2. Make sure the package is added to app's `build.gradle`
  3. Make sure `PosPrinterPackage` is added to `getPackages()` in `MainApplication.java`
  4. Clean project and rebuild

### 3. Permissions Issues

**Issue**: Cannot discover or connect to printers

**Solution**:
This is often related to missing permissions.

**Steps to fix**:
- For iOS:
  1. Add the required permissions to `Info.plist`
  2. For Bluetooth, add NSBluetoothAlwaysUsageDescription
  3. For external accessories, add UISupportedExternalAccessoryProtocols

- For Android:
  1. Add the required permissions to `AndroidManifest.xml`
  2. For Android 6.0+, request runtime permissions for Bluetooth and Location

### 4. Event Listeners Not Working

**Issue**: Event listeners for printer status or connection changes don't fire

**Solution**:
The module has been updated to handle this gracefully with proper error checking.

**Steps to fix**:
1. Make sure you're properly adding and removing listeners
2. Check that the native module is correctly initialized
3. Verify that the printer supports status notifications

### 5. Printing Issues

**Issue**: Cannot print or printing is garbled

**Solution**:
This could be related to printer compatibility or command format issues.

**Steps to fix**:
1. Verify the printer is ESC/POS compatible
2. Check printer connection status before printing
3. Try using simpler commands first (plain text)
4. Check printer documentation for specific command requirements

## Debugging Tips

1. **Enable verbose logging**: Add console logs to track the flow of operations
2. **Check native module registration**: Verify the native module is available by logging `NativeModules.PosPrinterModule`
3. **Test with mock data**: If no physical printer is available, use mock implementations
4. **Verify printer connection**: Always check connection status before sending commands
5. **Platform-specific issues**: Some features may work differently on iOS vs Android

## Getting Help

If you encounter issues not covered in this guide:
1. Check the GitHub repository issues section
2. Verify your React Native version compatibility
3. Check the Epson ESC/POS SDK documentation for specific printer limitations
