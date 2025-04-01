import React, {useState, forwardRef, ForwardedRef, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Modal,
  ScrollView,
  Dimensions,
} from 'react-native';
import {LoanCollateralType} from '../../api/types/loanRequest';
import {AppIcons} from '../../icons';
import {Theme} from '../../theme/colors';

// Get screen dimensions for better responsive behavior
const SCREEN_HEIGHT = Dimensions.get('window').height;
const MAX_DROPDOWN_HEIGHT = SCREEN_HEIGHT * 0.4; // 40% of screen height maximum

interface CustomMultiSelectProps {
  value: string[];
  options: Array<{value: string; label: string}>;
  placeholder: string;
  onChange: (value: string[]) => void;
  onItemSelect: (value: LoanCollateralType) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  theme: Theme;
}

const CustomMultiSelect = forwardRef(
  (
    {
      value,
      options,
      placeholder,
      onChange,
      onItemSelect,
      isOpen,
      setIsOpen,
      theme,
    }: CustomMultiSelectProps,
    ref: ForwardedRef<View>,
  ) => {
    const [inputLayout, setInputLayout] = useState({
      pageY: 0,
      height: 0,
    });

    // Calculate the available space below the input
    const spaceBelow = SCREEN_HEIGHT - (inputLayout.pageY + inputLayout.height);
    // Determine dropdown height based on available space
    const dropdownHeight = Math.min(spaceBelow - 100, MAX_DROPDOWN_HEIGHT);

    const styles = StyleSheet.create({
      multiSelectContainer: {
        position: 'relative',
      },
      inputContainer: {
        backgroundColor: theme.inputBackground,
        borderRadius: 8,
        paddingHorizontal: 15,
        paddingVertical: 8,
        minHeight: 45,
        flexDirection: 'row',
        alignItems: 'center',
        position: 'relative',
        borderWidth: 1,
        borderColor: theme.borderInputBackground,
      },
      tagsContainer: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 6,
      },
      tag: {
        backgroundColor: '#e3f0ff',
        borderRadius: 16,
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 4,
        paddingHorizontal: 8,
      },
      tagText: {
        color: '#007BFF',
        fontSize: 14,
        marginRight: 4,
      },
      removeTag: {
        color: '#007BFF',
        fontSize: 16,
        fontWeight: '600',
      },
      rightContainer: {
        flexDirection: 'row',
        alignItems: 'center',
      },
      clearAll: {
        padding: 8,
        marginRight: 4,
      },
      clearAllText: {
        color: '#666',
        fontSize: 16,
        fontWeight: '500',
      },
      arrowIcon: {
        width: 18,
        height: 18,
      },
      placeholder: {
        color: '#999',
        fontSize: 14,
      },
      dropdown: {
        position: 'absolute',
        top: '100%',
        left: 0,
        right: 0,
        backgroundColor: 'white',
        marginTop: 4,
        borderRadius: 8,
        padding: 8,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
        zIndex: 1000,
      },
      option: {
        padding: 12,
        borderRadius: 6,
        marginVertical: 2,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      },
      optionSelected: {
        backgroundColor: '#f0f9ff',
      },
      optionText: {
        fontSize: 14,
        color: '#333',
      },
      checkmark: {
        color: '#007BFF',
        fontWeight: 'bold',
      },
      modalOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.1)',
      },
      modalContent: {
        position: 'absolute',
        top: inputLayout.pageY + inputLayout.height + 6, // 6px spacing from input
        left: 16,
        right: 16,
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 12,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        maxHeight: dropdownHeight, // Dynamic max height
      },
      optionsContainer: {
        width: '100%',
      },
      optionsScrollView: {
        width: '100%', // Ensure full width
      },
      optionItem: {
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      },
      lastOptionItem: {
        borderBottomWidth: 0,
      },
    });

    const measureInput = () => {
      if (ref && 'current' in ref && ref.current) {
        ref.current.measure((x, y, width, height, pageX, pageY) => {
          setInputLayout({
            pageY: pageY,
            height: height,
          });
        });
      }
    };

    useEffect(() => {
      if (isOpen) {
        measureInput();
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen]);

    return (
      <View
        ref={ref}
        style={styles.multiSelectContainer}
        onLayout={measureInput}>
        <TouchableOpacity
          style={styles.inputContainer}
          onPress={() => setIsOpen(!isOpen)}
          activeOpacity={0.7}>
          <View style={styles.tagsContainer}>
            {value.length > 0 ? (
              value.map((type: string) => {
                const item = options.find(t => t.value === type);
                return (
                  <View key={type} style={styles.tag}>
                    <Text style={styles.tagText}>{item?.label}</Text>
                    <TouchableOpacity
                      onPress={e => {
                        e.stopPropagation();
                        onItemSelect(type as LoanCollateralType);
                      }}>
                      {/* <Text style={styles.removeTag}>×</Text> */}
                    </TouchableOpacity>
                  </View>
                );
              })
            ) : (
              <Text style={styles.placeholder}>{placeholder}</Text>
            )}
          </View>
          <View style={styles.rightContainer}>
            {value.length > 0 && (
              <TouchableOpacity
                style={styles.clearAll}
                onPress={e => {
                  e.stopPropagation();
                  onChange([]);
                }}>
                <Text style={styles.clearAllText}>×</Text>
              </TouchableOpacity>
            )}
            <Image
              source={isOpen ? AppIcons.chevronUp : AppIcons.chevronDown}
              style={styles.arrowIcon}
            />
          </View>
        </TouchableOpacity>

        <Modal
          visible={isOpen}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setIsOpen(false)}>
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setIsOpen(false)}>
            <View style={styles.modalContent}>
              <ScrollView
                style={styles.optionsScrollView}
                showsVerticalScrollIndicator={true}
                bounces={false}
                contentContainerStyle={{paddingBottom: 5}}>
                {options.map((item, index) => {
                  const isSelected = value.includes(item.value);
                  const isLastItem = index === options.length - 1;
                  return (
                    <TouchableOpacity
                      key={item.value}
                      style={[
                        styles.optionItem,
                        isSelected && styles.optionSelected,
                        isLastItem && styles.lastOptionItem,
                      ]}
                      onPress={() => {
                        onItemSelect(item.value as LoanCollateralType);
                      }}>
                      <Text style={styles.optionText}>{item.label}</Text>
                      {isSelected && <Text style={styles.checkmark}>✓</Text>}
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          </TouchableOpacity>
        </Modal>
      </View>
    );
  },
);

export default CustomMultiSelect;
