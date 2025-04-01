/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

// Register the main component with explicit typing
AppRegistry.registerComponent(appName, () => App);
