import React, {useState, useEffect, useRef} from 'react';
import {View, Text, StyleSheet, Alert, Dimensions, Platform, BackHandler} from 'react-native';
import {Camera, CameraType} from 'react-native-camera-kit';
import {RouteProp} from '@react-navigation/native';
import {useFocusEffect} from '@react-navigation/native';
import Header from '../components/Header/Header';
import {useTranslation} from 'react-i18next';
import {RootStackParamList} from '../navigators/RootNavigator';
import {StackNavigationProp} from '@react-navigation/stack';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;
const scanAreaSize = Math.min(SCREEN_WIDTH * 0.75, SCREEN_HEIGHT * 0.35);

// Fixed zoom level - 1.0 is the maximum in the library (approximates 3x zoom)
const FIXED_ZOOM = 2.0;

type QRScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'QrScreen'
>;
type QRScreenRouteProp = RouteProp<RootStackParamList, 'QrScreen'>;

interface QRScannerAppProps {
  navigation: QRScreenNavigationProp;
  route: QRScreenRouteProp;
}

const QRScannerApp: React.FC<QRScannerAppProps> = ({navigation, route}) => {
  const {t} = useTranslation();
  const {formDataAddress, formDataUser} = route.params;

  const [lastScannedCode, setLastScannedCode] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState<boolean>(true);

  const isDuplicateCode = (code: string) => {
    return lastScannedCode === code;
  };

  const formatDate = (dateStr: string) => {
    if (dateStr.length === 8) {
      const day = dateStr.substring(0, 2);
      const month = dateStr.substring(2, 4);
      const year = dateStr.substring(4, 8);
      return `${day}/${month}/${year}`;
    }
    if (dateStr.length === 6) {
      const day = dateStr.substring(0, 2);
      const month = dateStr.substring(2, 4);
      const year = '20' + dateStr.substring(4, 6);
      return `${day}/${month}/${year}`;
    }
    return dateStr;
  };

  // Xử lý dữ liệu QR trên CCCD
  const processQRData = (rawData: string) => {
    let cleanData = rawData.trim().replace(/^{|}$/g, '');
    const dataArray = cleanData.split('|').map(item => item.trim());
    if (dataArray.length > 6) {
      dataArray[3] = formatDate(dataArray[3]);
      dataArray[6] = formatDate(dataArray[6]);
    }
    return dataArray;
  };

  const handleCodeScanned = (event: {
    nativeEvent: {codeStringValue: string};
  }) => {
    const currentCode = event.nativeEvent.codeStringValue;
    if (!isScanning || !currentCode || isDuplicateCode(currentCode)) return;

    try {
      const qrData = processQRData(currentCode);
      setLastScannedCode(currentCode);
      setIsScanning(false);
      navigation.navigate('ResultQR', {
        formDataUser: formDataUser,
        formDataAddress: formDataAddress,
        qrData: qrData,
      });
    } catch (error) {
      console.log('Scanning error:', error);
      Alert.alert('Error', 'Failed to process QR code');
    }
  };

  // Reset scanner state when component is focused (coming back from ResultQR screen)
  useFocusEffect(
    React.useCallback(() => {
      console.log('Screen focused, resetting scanner state');
      setLastScannedCode(null);
      setIsScanning(true);

      return () => {
        // This runs when the screen is unfocused
        console.log('Screen unfocused');
      };
    }, []),
  );

  // Add a reset function that can be called manually if needed
  const resetScanner = () => {
    setLastScannedCode(null);
    setIsScanning(true);
  };

  return (
    <View style={styles.container}>
      <Header Navbar="ScanQR" navigation={navigation} />

      <View style={styles.contentContainer}>
        <View style={styles.squareFrame}>
          <Camera
            scanBarcode={true}
            onReadCode={handleCodeScanned}
            laserColor="red" // (default red) optional, color of laser in scanner frame
            frameColor="white" // (default white) optional, color of border of scanner frame
            showFrame={false}
            style={styles.camera}
            cameraType={CameraType.Back}
            flashMode="off"
            ratioOverlay="1:1"
            zoom={FIXED_ZOOM} // Set fixed 3x zoom (1.0 = max zoom in the library)
            onZoom={e => console.log(e.nativeEvent.zoom)}
          />
        </View>

        <Text style={styles.instructionText}>
          {t('register.camera.scanScreen.instruction') ||
            'Vui lòng đặt QR để quét'}
        </Text>

        {/* Zoom indicator
        <Text style={styles.zoomIndicator}>3x Zoom</Text> */}

        {/* Scan status indicator - useful for debugging */}
        <Text style={styles.scanStatus}>
          {isScanning ? 'Ready to scan' : 'QR detected'}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  squareFrame: {
    width: scanAreaSize,
    height: scanAreaSize,
    borderWidth: 3,
    borderColor: '#FFFFFF',
    borderRadius: 10,
    backgroundColor: 'black',
    overflow: 'hidden',
  },
  camera: {
    width: '100%',
    height: '100%',
  },
  instructionText: {
    fontSize: 16,
    fontWeight: 'bold',
    padding: 16,
    textAlign: 'center',
    color: '#FFF',
    backgroundColor: 'rgba(0,0,0,0.6)',
    marginTop: 15,
    borderRadius: 8,
    width: '90%',
  },
  zoomIndicator: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.6)',
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
    padding: 6,
    borderRadius: 12,
    overflow: 'hidden',
  },
  scanStatus: {
    position: 'absolute',
    bottom: 10,
    backgroundColor: 'rgba(0,0,0,0.6)',
    color: '#FFF',
    fontSize: 12,
    padding: 6,
    borderRadius: 12,
    opacity: 0.7,
  },
});

export default QRScannerApp;
