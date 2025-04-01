import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React from 'react';
import {Theme} from '../../theme/colors';

interface TabItem {
  key: string;
  label: string;
}

// Create a subset of Theme with only the properties we need

interface SelectedTabsProps {
  tabs: TabItem[];
  selectedTab: string;
  onSelectTab: (key: string) => void;
  theme: Theme; // Use the imported Theme type
}

const SelectedTabs: React.FC<SelectedTabsProps> = ({
  tabs,
  selectedTab,
  onSelectTab,
  theme,
}) => {
  const styles = StyleSheet.create({
    tabBar: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 20,
    },
    tab: {
      padding: 12,
      backgroundColor: theme.tabBarInactive,
      borderRadius: 10,
      width: '48%',
      alignItems: 'center',
    },
    activeTab: {
      backgroundColor: theme.tabBarActive,
    },
    tabText: {
      color: theme.textInactive || '#000', // Provide fallback for undefined
      fontWeight: 'bold',
    },
    tabTextActive: {
      color: '#fff',
    },
  });

  return (
    <View style={styles.tabBar}>
      {tabs.map(tab => (
        <TouchableOpacity
          key={tab.key}
          style={[styles.tab, selectedTab === tab.key && styles.activeTab]}
          onPress={() => onSelectTab(tab.key)}>
          <Text
            style={[
              styles.tabText,
              selectedTab === tab.key && styles.tabTextActive,
            ]}>
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default SelectedTabs;
