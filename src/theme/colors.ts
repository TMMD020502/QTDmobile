// Define the structure for theme objects
// This interface ensures consistency across light and dark themes
export interface Theme {
  // Basic UI colors
  background: string; // Main background color
  text: string; // Primary text color
  noteText: string; // Secondary/note text color
  tint: string; // Tint color for various UI elements
  inputBackground: string;
  borderInputBackground: string;

  // Header related colors
  headerBackground: string;
  headerShadow: string;

  // Icon related colors
  backgroundIcon: string;
  iconColor: string;
  iconColorActive: string;
  iconPrimaryColor: string;
  iconShortCut: string;

  // Box and container colors
  backgroundBox: string;

  // Text state colors
  textActive: string;
  textInactive?: string;

  // Button colors
  buttonSubmit: string;
  textButtonSubmit: string;

  // Special indicators
  profit: string;
  interest: string;
  error: string;

  // Tab bar related colors
  tabBarBackground: string;
  tabBarInactive: string;
  tabBarActive: string;

  // Table related colors
  tableHeaderBackground: string;
  tableChildBackground: string;
  tableBorderColor: string;
}

// Light theme configuration
export const lightTheme: Theme = {
  background: '#FFFFFF',
  text: '#000000',
  noteText: '#AAAAAA',
  tint: '#000000',
  headerBackground: '#FFFFFF',
  headerShadow: '#171717',
  backgroundIcon: '#f7faff',
  iconColor: '#888',
  iconColorActive: '#007BFF',
  backgroundBox: '#f7faff',
  textActive: '#007BFF',
  buttonSubmit: '#007BFF',
  textButtonSubmit: '#fff',
  inputBackground: '#ffffff',
  borderInputBackground: '#007BFF',
  iconPrimaryColor: '#FFFFFF',
  iconShortCut: '#007BFF',

  //profit
  profit: '#18DD12',
  interest: '#ddb813',
  error: '#ff4444',

  tabBarBackground: '#FFFFFF',
  tabBarInactive: '#ddd',
  tabBarActive: '#007BFF',
  // textActive: '#ffffff',
  textInactive: '#000',

  // table
  tableHeaderBackground: '#f7faff',
  tableChildBackground: '#fff',
  tableBorderColor: '#f7faff',
};

// Dark theme configuration
export const darkTheme: Theme = {
  background: '#1c1e21',
  text: '#FFFFFF',
  noteText: 'rgba(255, 255, 255, 0.7)',
  tint: '#FFFFFF',
  headerBackground: '#000000',
  headerShadow: '#fff',
  backgroundIcon: '#000',
  iconColor: '#fff',
  iconColorActive: '#007BFF',
  backgroundBox: '#444950',
  textActive: '#ffffff',
  buttonSubmit: '#007BFF',
  textButtonSubmit: '#fff',
  inputBackground: '#f4f4f4',
  borderInputBackground: '#f4f4f4',
  iconPrimaryColor: '#FFFFFF',
  iconShortCut: '#444950',

  //profit
  profit: '#76FA39',
  interest: '#f2df37',
  error: '#ff6666',

  tabBarBackground: '#121212',
  tabBarInactive: '#fff',
  tabBarActive: '#007BFF',

  // table
  tableHeaderBackground: '#999999',
  tableChildBackground: '#444950',
  tableBorderColor: '#999999',
};
