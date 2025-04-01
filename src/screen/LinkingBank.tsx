import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Modal,
  TextInput,
  FlatList,
  Dimensions,
  Image,
  TouchableWithoutFeedback,
  Animated,
  Easing,
} from 'react-native';

import React, {useState, useEffect} from 'react';
import Header from '../components/Header/Header';
import {useTranslation} from 'react-i18next';
import {useTheme} from '../context/ThemeContext';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../navigators/RootNavigator';
import {AppIcons} from '../icons';

type LinkingBankNavigationProp = StackNavigationProp<
  RootStackParamList,
  'LinkingBank'
>;

interface LinkingBankProps {
  navigation: LinkingBankNavigationProp;
}

interface Bank {
  id: string;
  name: string;
  icon: any;
}

// Use actual bank icons or default to bank icon
const mockBanks: Bank[] = [
  {id: '1', name: 'VietcomBank', icon: AppIcons.vcb},
  {id: '2', name: 'BIDV', icon: AppIcons.BIDV},
  {id: '11', name: 'Agribank', icon: AppIcons.agr},
  {id: '8', name: 'Vietinbank', icon: AppIcons.ctg},
  {id: '3', name: 'Techcombank', icon: AppIcons.tcb},
  {id: '4', name: 'MB Bank', icon: AppIcons.mbb},
  {id: '5', name: 'ACB', icon: AppIcons.acb},
  {id: '6', name: 'VP Bank', icon: AppIcons.vpb},
  {id: '7', name: 'Sacombank', icon: AppIcons.stb},
  {id: '9', name: 'HD Bank', icon: AppIcons.hdb},
  {id: '10', name: 'SHB', icon: AppIcons.shb},
  {id: '12', name: 'MSB', icon: AppIcons.msb},
  {id: '13', name: 'TP Bank', icon: AppIcons.tpBank},
];

const LinkingBank: React.FC<LinkingBankProps> = ({navigation}) => {
  const {t} = useTranslation();
  const {theme} = useTheme();
  const [modalVisible, setModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [linkedBanks, setLinkedBanks] = useState<Bank[]>([]);
  const [filteredBanks, setFilteredBanks] = useState<Bank[]>(mockBanks);
  const screenHeight = Dimensions.get('window').height;

  // Animation value for sliding content
  const slideAnimation = useState(new Animated.Value(screenHeight))[0];

  useEffect(() => {
    // Run slide animation when modal visibility changes
    if (modalVisible) {
      slideAnimation.setValue(screenHeight); // Reset position before animating
      Animated.timing(slideAnimation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
        easing: Easing.out(Easing.ease),
      }).start();
    }
  }, [modalVisible, screenHeight, slideAnimation]);

  // Function to close modal with animation
  const closeModal = () => {
    Animated.timing(slideAnimation, {
      toValue: screenHeight,
      duration: 250,
      useNativeDriver: true,
      easing: Easing.in(Easing.ease),
    }).start(() => {
      setModalVisible(false);
    });
  };

  useEffect(() => {
    const filtered = mockBanks.filter(bank =>
      bank.name.toLowerCase().includes(searchText.toLowerCase()),
    );
    setFilteredBanks(filtered);
  }, [searchText]);

  const handleBankSelection = (bank: Bank) => {
    if (!linkedBanks.find(b => b.id === bank.id)) {
      setLinkedBanks([...linkedBanks, bank]);
    }
    setModalVisible(false);
  };

  const handleRemoveBank = (bankId: string) => {
    setLinkedBanks(linkedBanks.filter(bank => bank.id !== bankId));
  };

  const styles = StyleSheet.create({
    view: {
      flex: 1,
      backgroundColor: theme.background,
    },
    container: {
      width: '100%',
      height: '100%',
    },
    body: {
      marginTop: 16,
      paddingHorizontal: 20,
      flex: 1,
    },
    textWhite: {
      color: 'white',
    },
    textPrimary: {
      color: theme.textActive,
    },
    iconPrimary: {
      tintColor: theme.iconColorActive,
    },
    btn: {
      width: '100%',
      backgroundColor: theme.buttonSubmit,
      padding: 12,
      borderRadius: 12,
      marginTop: 8,
      alignItems: 'center',
    },
    bottomButton: {
      position: 'absolute',
      bottom: 20,
      left: 20,
      right: 20,
    },
    hidden: {
      opacity: 0,
      pointerEvents: 'none',
    },
    optionContainer: {
      flexDirection: 'column',
      marginBottom: 8,
    },
    radioButton: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 10,
      alignSelf: 'flex-start',
      paddingVertical: 8,
    },
    radioCircle: {
      height: 20,
      width: 20,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: theme.text,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 10,
      padding: 4,
    },
    radioFill: {
      width: '100%',
      height: '100%',
      backgroundColor: theme.buttonSubmit,
      borderRadius: 7,
    },
    label: {
      fontSize: 16,
      color: theme.text,
    },
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      padding: 20,
    },
    modalContent: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: theme.background,
      height: screenHeight * 0.7,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      padding: 20,
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: -2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    searchContainer: {
      backgroundColor: theme.backgroundBox,
      borderRadius: 12,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 15,
      marginBottom: 15,
    },
    searchInput: {
      flex: 1,
      height: 40,
      color: theme.text,
      paddingLeft: 8,
    },
    bankListItem: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 15,
      borderBottomWidth: 1,
      borderBottomColor: theme.tableBorderColor,
    },
    bankName: {
      marginLeft: 10,
      fontSize: 16,
      color: theme.text,
    },
    emptyState: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingTop: 0,
    },
    emptyStateText: {
      fontSize: 16,
      color: theme.noteText,
      textAlign: 'center',
      marginTop: 10,
      paddingHorizontal: 20,
    },
    linkedBankItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 15,
      backgroundColor: theme.backgroundBox,
      marginBottom: 10,
      borderRadius: 12,
    },
    leftContent: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.text,
      marginVertical: 15,
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 15,
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: theme.text,
    },
    closeButton: {
      padding: 5,
    },
    bankIcon: {
      width: 50,
      height: 50,
      borderRadius: 8,
      overflow: 'hidden',
      marginRight: 10,
      backgroundColor: theme.tableBorderColor,
      justifyContent: 'center',
      alignItems: 'center',
    },
    bankIconImage: {
      width: '80%',
      height: '80%',
      resizeMode: 'contain',
    },
    icon: {
      width: 24,
      height: 24,
      resizeMode: 'contain',
      tintColor: theme.text,
    },
    searchIcon: {
      width: 20,
      height: 20,
      resizeMode: 'contain',
      tintColor: theme.noteText,
    },
    removeIcon: {
      width: 20,
      height: 20,
      resizeMode: 'contain',
      tintColor: theme.error,
    },
    alertIcon: {
      width: 40,
      height: 40,
      resizeMode: 'contain',
      tintColor: theme.noteText,
    },
    removeButton: {
      padding: 8,
      borderRadius: 20,
      backgroundColor: 'rgba(255, 0, 0, 0.1)',
    },
  });

  return (
    <SafeAreaView style={styles.view}>
      <View style={styles.container}>
        {/* Heading */}
        <Header Navbar="LinkingBank" navigation={navigation} />

        {/* Body */}
        <View style={styles.body}>
          {linkedBanks.length > 0 ? (
            <View>
              <Text style={styles.sectionTitle}>
                {t('linkBank.linkedBanks')}
              </Text>
              {linkedBanks.map(bank => (
                <View key={bank.id} style={styles.linkedBankItem}>
                  <View style={styles.leftContent}>
                    <View style={styles.bankIcon}>
                      <Image source={bank.icon} style={styles.bankIconImage} />
                    </View>
                    <Text style={styles.bankName}>{bank.name}</Text>
                  </View>
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => handleRemoveBank(bank.id)}>
                    <Image
                      source={AppIcons.closeIcon}
                      style={styles.removeIcon}
                    />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Image source={AppIcons.infoIcon} style={styles.alertIcon} />
              <Text style={styles.emptyStateText}>
                {t('linkBank.emptyState')}
              </Text>
            </View>
          )}
        </View>

        {/* Bottom Button */}
        <View style={styles.bottomButton}>
          <TouchableOpacity
            style={styles.btn}
            onPress={() => setModalVisible(true)}>
            <Text style={styles.textWhite}>{t('linkBank.linkBankButton')}</Text>
          </TouchableOpacity>
        </View>

        {/* Bank Selection Modal */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={closeModal}>
          <TouchableWithoutFeedback onPress={closeModal}>
            <View style={styles.modalContainer}>
              <TouchableWithoutFeedback onPress={e => e.stopPropagation()}>
                <Animated.View
                  style={[
                    styles.modalContent,
                    {
                      transform: [{translateY: slideAnimation}],
                    },
                  ]}>
                  <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>
                      {t('linkBank.selectBank')}
                    </Text>
                    <TouchableOpacity
                      style={styles.closeButton}
                      onPress={closeModal}>
                      <Image source={AppIcons.closeIcon} style={styles.icon} />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.searchContainer}>
                    <Image
                      source={AppIcons.searchIcon}
                      style={styles.searchIcon}
                    />
                    <TextInput
                      style={styles.searchInput}
                      placeholder={t('linkBank.searchBank')}
                      placeholderTextColor={theme.noteText}
                      value={searchText}
                      onChangeText={setSearchText}
                    />
                  </View>

                  <FlatList
                    data={filteredBanks}
                    keyExtractor={item => item.id}
                    renderItem={({item}) => (
                      <TouchableOpacity
                        style={styles.bankListItem}
                        onPress={() => handleBankSelection(item)}>
                        <View style={styles.bankIcon}>
                          <Image
                            source={item.icon}
                            style={styles.bankIconImage}
                          />
                        </View>
                        <Text style={styles.bankName}>{item.name}</Text>
                      </TouchableOpacity>
                    )}
                  />
                </Animated.View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

export default LinkingBank;
