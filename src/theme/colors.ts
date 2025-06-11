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
  dialogBackground: string;
}

// Light theme configuration
export const lightTheme: Theme = {
  background: '#FFFFFF', // Nền chính (trắng)
  text: '#000000', // Màu chữ chính (đen)
  noteText: 'rgba(255, 255, 255, 1)', // Chữ phụ/chú thích (xám nhạt)
  tint: '#000000', // Màu nhấn phụ (đen)
  headerBackground: '#FFFFFF', // Nền header (trắng)
  headerShadow: '#171717', // Bóng header (xám đậm)
  backgroundIcon: '#f7faff', // Nền icon (xanh rất nhạt)
  iconColor: '#888', // Màu icon mặc định (xám)
  iconColorActive: '#007BFF', // Màu icon khi active (xanh dương)
  backgroundBox: '#f7faff', // Nền box/container (xanh rất nhạt)
  textActive: '#007BFF', // Màu chữ khi active (xanh dương)
  buttonSubmit: '#007BFF', // Nút submit (xanh dương)
  textButtonSubmit: '#fff', // Chữ trên nút submit (trắng)
  inputBackground: '#ffffff', // Nền input (trắng)
  borderInputBackground: '#007BFF', // Viền input khi focus (xanh dương)
  iconPrimaryColor: '#FFFFFF', // Icon chính (trắng)
  iconShortCut: '#007BFF', // Icon shortcut (xanh dương)

  //profit
  profit: '#18DD12', // Lợi nhuận (xanh lá)
  interest: '#ddb813', // Lãi suất (vàng)
  error: '#ff4444', // Lỗi (đỏ tươi)

  tabBarBackground: '#FFFFFF', // Nền tab bar (trắng)
  tabBarInactive: '#ddd', // Tab bar không active (xám nhạt)
  tabBarActive: '#007BFF', // Tab bar active (xanh dương)
  textInactive: '#000', // Chữ không active (đen)

  // table
  tableHeaderBackground: '#f7faff', // Nền header bảng (xanh rất nhạt)
  tableChildBackground: '#fff', // Nền dòng bảng (trắng)
  tableBorderColor: '#f7faff', // Viền bảng (xanh rất nhạt)
  dialogBackground: 'rgba(255,255,255,0.5)', // Nền dialog (trắng rất nhạt)
};

// Dark theme configuration
export const darkTheme: Theme = {
  background: '#1c1e21', // Nền chính (xám đen)
  text: '#FFFFFF', // Màu chữ chính (trắng)
  noteText: 'rgba(255, 255, 255, 1)', // Chữ phụ/chú thích (trắng mờ)
  tint: '#FFFFFF', // Màu nhấn phụ (trắng)
  headerBackground: '#000000', // Nền header (đen)
  headerShadow: '#fff', // Bóng header (trắng)
  backgroundIcon: '#000', // Nền icon (đen)
  iconColor: '#fff', // Màu icon mặc định (trắng)
  iconColorActive: '#007BFF', // Màu icon khi active (xanh dương)
  backgroundBox: '#2C3038', // Nền box/container (xám đậm)
  textActive: '#000000', // Màu chữ khi active (trắng)
  buttonSubmit: '#007BFF', // Nút submit (xanh dương)
  textButtonSubmit: '#fff', // Chữ trên nút submit (trắng)
  inputBackground: '#1c1e21', // Nền input (xám rất nhạt #f4f4f4)
  borderInputBackground: '#f4f4f4', // Viền input khi focus (xám rất nhạt)
  iconPrimaryColor: '#FFFFFF', // Icon chính (trắng)
  iconShortCut: '#444950', // Icon shortcut (xám xanh đậm)

  //profit
  profit: '#76FA39', // Lợi nhuận (xanh lá)
  interest: '#f2df37', // Lãi suất (vàng)
  error: '#ff6666', // Lỗi (đỏ nhạt)

  tabBarBackground: '#121212', // Nền tab bar (đen xám)
  tabBarInactive: '#fff', // Tab bar không active (trắng)
  tabBarActive: '#007BFF', // Tab bar active (xanh dương)

  // table
  tableHeaderBackground: '#999999', // Nền header bảng (xám)
  tableChildBackground: '#444950', // Nền dòng bảng (xám xanh đậm)
  tableBorderColor: '#999999', // Viền bảng (xám)
  dialogBackground: 'rgba(0,0,0,0.5)', // Nền dialog (đen rất nhạt)
};
