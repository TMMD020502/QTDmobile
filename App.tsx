/* eslint-disable react-native/no-inline-styles */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
// import 'react-native-gesture-handler'; // Đảm bảo import trước bất kỳ thư viện nào khác

import React, {useEffect} from 'react';
import {View, Text} from 'react-native';

import RootNavigator from './src/navigators/RootNavigator';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {LanguageProvider} from './src/context/LanguageContext';
import './i18n';
import ThemeProvider from './src/context/ThemeContext';
import {AuthProvider} from './src/context/AuthContext';
import {Provider} from 'react-redux';
import {store} from './src/store/store';
import SplashScreen from 'react-native-splash-screen';
interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = {hasError: false};

  static getDerivedStateFromError(): ErrorBoundaryState {
    return {hasError: true};
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error('Auth Error:', error, errorInfo);
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      return (
        // eslint-disable-next-line react-native/no-inline-styles
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text>Something went wrong with authentication.</Text>
        </View>
      );
    }
    return this.props.children;
  }
}

function App(): React.ReactNode {
  const queryClient = new QueryClient();

  useEffect(() => {
    setTimeout(() => {
      SplashScreen.hide();
    }, 1000);
  }, []);
  return (
    <Provider store={store}>
      <SafeAreaProvider style={{flex: 1}}>
        <ErrorBoundary>
          <QueryClientProvider client={queryClient}>
            <ThemeProvider>
              <LanguageProvider>
                <AuthProvider>
                  <RootNavigator />
                </AuthProvider>
              </LanguageProvider>
            </ThemeProvider>
          </QueryClientProvider>
        </ErrorBoundary>
      </SafeAreaProvider>
    </Provider>
  );
}

export default App;
