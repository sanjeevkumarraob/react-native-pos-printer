import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  FlatList,
  Image,
  Alert,
} from 'react-native';

import PosPrinter, {
  PrinterConnectionType,
  TextAlignment,
  BarcodeType,
  CutPaperType,
  PrinterEvents,
} from 'react-native-pos-printer';

const App = () => {
  const [printers, setPrinters] = useState([]);
  const [connectedPrinter, setConnectedPrinter] = useState(null);
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState('Hello, World!');
  const [eventListeners, setEventListeners] = useState({ connection: null, status: null });

  useEffect(() => {
    // Add printer connection listener with error handling
    try {
      const connectionListener = PrinterEvents.addPrinterConnectionListener((event) => {
        console.log('Printer connection changed:', event);
        if (event && event.connected) {
          setConnectedPrinter(event.printer);
        } else {
          setConnectedPrinter(null);
        }
      });

      // Add printer status listener with error handling
      const statusListener = PrinterEvents.addPrinterStatusListener((event) => {
        console.log('Printer status changed:', event);
        if (event && event.isError) {
          Alert.alert('Printer Error', event.errorMessage || 'Unknown printer error');
        }
      });

      setEventListeners({ connection: connectionListener, status: statusListener });

      // Check for current printer
      checkCurrentPrinter();

      // Cleanup
      return () => {
        try {
          if (eventListeners.connection !== null && eventListeners.connection !== -1) {
            PrinterEvents.removePrinterConnectionListener(eventListeners.connection);
          }
          if (eventListeners.status !== null && eventListeners.status !== -1) {
            PrinterEvents.removePrinterStatusListener(eventListeners.status);
          }
        } catch (error) {
          console.warn('Error removing event listeners:', error);
        }
      };
    } catch (error) {
      console.warn('Error setting up event listeners:', error);
    }
  }, []);

  const checkCurrentPrinter = async () => {
    try {
      const printer = await PosPrinter.getCurrentPrinter();
      if (printer) {
        setConnectedPrinter(printer);
      }
    } catch (error) {
      console.error('Error checking current printer:', error);
    }
  };

  const discoverPrinters = async () => {
    setLoading(true);
    try {
      const discoveredPrinters = await PosPrinter.getAvailablePrinters(PrinterConnectionType.ALL);
      setPrinters(discoveredPrinters || []);
    } catch (error) {
      console.error('Error discovering printers:', error);
      Alert.alert('Error', 'Failed to discover printers: ' + (error.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const connectToPrinter = async (printer) => {
    setLoading(true);
    try {
      await PosPrinter.connectToPrinter(printer);
    } catch (error) {
      console.error('Error connecting to printer:', error);
      Alert.alert('Error', 'Failed to connect to printer: ' + (error.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const disconnectPrinter = async () => {
    setLoading(true);
    try {
      await PosPrinter.disconnectPrinter();
    } catch (error) {
      console.error('Error disconnecting printer:', error);
      Alert.alert('Error', 'Failed to disconnect printer: ' + (error.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const printText = async () => {
    if (!connectedPrinter) {
      Alert.alert('Error', 'No printer connected');
      return;
    }

    setLoading(true);
    try {
      await PosPrinter.printText(text, {
        alignment: TextAlignment.CENTER,
        fontSize: 2,
        bold: true,
      });
      Alert.alert('Success', 'Text printed successfully');
    } catch (error) {
      console.error('Error printing text:', error);
      Alert.alert('Error', 'Failed to print text: ' + (error.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const printReceipt = async () => {
    if (!connectedPrinter) {
      Alert.alert('Error', 'No printer connected');
      return;
    }

    setLoading(true);
    try {
      const receipt = {
        items: [
          {
            type: 'text',
            data: 'RECEIPT',
            options: {
              alignment: TextAlignment.CENTER,
              fontSize: 2,
              bold: true,
            },
          },
          {
            type: 'text',
            data: '--------------------------------',
            options: {
              alignment: TextAlignment.CENTER,
            },
          },
          {
            type: 'text',
            data: 'Item 1                    $10.00',
            options: {
              alignment: TextAlignment.LEFT,
            },
          },
          {
            type: 'text',
            data: 'Item 2                     $5.00',
            options: {
              alignment: TextAlignment.LEFT,
            },
          },
          {
            type: 'text',
            data: '--------------------------------',
            options: {
              alignment: TextAlignment.CENTER,
            },
          },
          {
            type: 'text',
            data: 'TOTAL                     $15.00',
            options: {
              alignment: TextAlignment.LEFT,
              bold: true,
            },
          },
          {
            type: 'text',
            data: 'Thank you for your purchase!',
            options: {
              alignment: TextAlignment.CENTER,
            },
          },
          {
            type: 'qrcode',
            data: 'https://example.com/receipt/123',
            options: {
              alignment: TextAlignment.CENTER,
              size: 6,
            },
          },
        ],
        cutPaper: true,
        feedLines: 3,
      };

      await PosPrinter.printReceipt(receipt);
      Alert.alert('Success', 'Receipt printed successfully');
    } catch (error) {
      console.error('Error printing receipt:', error);
      Alert.alert('Error', 'Failed to print receipt: ' + (error.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const printQRCode = async () => {
    if (!connectedPrinter) {
      Alert.alert('Error', 'No printer connected');
      return;
    }

    setLoading(true);
    try {
      await PosPrinter.printQRCode('https://example.com', {
        size: 6,
        errorCorrection: 1,
        alignment: TextAlignment.CENTER,
      });
      Alert.alert('Success', 'QR code printed successfully');
    } catch (error) {
      console.error('Error printing QR code:', error);
      Alert.alert('Error', 'Failed to print QR code: ' + (error.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const cutPaper = async () => {
    if (!connectedPrinter) {
      Alert.alert('Error', 'No printer connected');
      return;
    }

    setLoading(true);
    try {
      await PosPrinter.cutPaper(CutPaperType.FULL);
      Alert.alert('Success', 'Paper cut successfully');
    } catch (error) {
      console.error('Error cutting paper:', error);
      Alert.alert('Error', 'Failed to cut paper: ' + (error.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const renderPrinterItem = ({ item }) => (
    <TouchableOpacity
      style={styles.printerItem}
      onPress={() => connectToPrinter(item)}
    >
      <Text style={styles.printerName}>{item.name || 'Unknown Printer'}</Text>
      <Text style={styles.printerInfo}>
        {item.model || 'Unknown Model'} - {item.type || 'Unknown Type'} - {item.address || 'Unknown Address'}
      </Text>
    </TouchableOpacity>
  );

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollView}>
          <Text style={styles.title}>React Native POS Printer</Text>

          {/* Printer Connection */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Printer Connection</Text>
            {connectedPrinter ? (
              <View style={styles.connectedPrinter}>
                <Text style={styles.connectedPrinterText}>
                  Connected to: {connectedPrinter.name || 'Unknown Printer'}
                </Text>
                <Text style={styles.printerInfo}>
                  {connectedPrinter.model || 'Unknown Model'} - {connectedPrinter.type || 'Unknown Type'} - {connectedPrinter.address || 'Unknown Address'}
                </Text>
                <TouchableOpacity
                  style={styles.button}
                  onPress={disconnectPrinter}
                  disabled={loading}
                >
                  <Text style={styles.buttonText}>Disconnect</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.button}
                onPress={discoverPrinters}
                disabled={loading}
              >
                <Text style={styles.buttonText}>Discover Printers</Text>
              </TouchableOpacity>
            )}

            {loading && <ActivityIndicator style={styles.loader} size="large" color="#0000ff" />}

            {printers.length > 0 && !connectedPrinter && (
              <FlatList
                data={printers}
                renderItem={renderPrinterItem}
                keyExtractor={(item, index) => item.id || `printer-${index}`}
                style={styles.printerList}
              />
            )}
          </View>

          {/* Print Text */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Print Text</Text>
            <TextInput
              style={styles.textInput}
              value={text}
              onChangeText={setText}
              multiline
              placeholder="Enter text to print"
            />
            <TouchableOpacity
              style={[styles.button, !connectedPrinter && styles.buttonDisabled]}
              onPress={printText}
              disabled={!connectedPrinter || loading}
            >
              <Text style={styles.buttonText}>Print Text</Text>
            </TouchableOpacity>
          </View>

          {/* Print Receipt */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Print Receipt</Text>
            <TouchableOpacity
              style={[styles.button, !connectedPrinter && styles.buttonDisabled]}
              onPress={printReceipt}
              disabled={!connectedPrinter || loading}
            >
              <Text style={styles.buttonText}>Print Sample Receipt</Text>
            </TouchableOpacity>
          </View>

          {/* Print QR Code */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Print QR Code</Text>
            <TouchableOpacity
              style={[styles.button, !connectedPrinter && styles.buttonDisabled]}
              onPress={printQRCode}
              disabled={!connectedPrinter || loading}
            >
              <Text style={styles.buttonText}>Print QR Code</Text>
            </TouchableOpacity>
          </View>

          {/* Cut Paper */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Cut Paper</Text>
            <TouchableOpacity
              style={[styles.button, !connectedPrinter && styles.buttonDisabled]}
              onPress={cutPaper}
              disabled={!connectedPrinter || loading}
            >
              <Text style={styles.buttonText}>Cut Paper</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollView: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#2196F3',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 5,
  },
  buttonDisabled: {
    backgroundColor: '#CCCCCC',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  loader: {
    marginVertical: 20,
  },
  printerList: {
    marginTop: 10,
    maxHeight: 200,
  },
  printerItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  printerName: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  printerInfo: {
    color: '#666666',
    fontSize: 14,
  },
  connectedPrinter: {
    marginBottom: 10,
  },
  connectedPrinterText: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
  },
});

export default App;
