import React, {useState, useEffect} from 'react';
import {View, ActivityIndicator} from 'react-native';
import {getApprovalProcess} from '../../api/services/getApplicationsLoan';
import {AssetType} from '../../api/types/addAssets';
import FormApartmentFields from './FormApartmentFields';
import FormLandFields from './FormLandFields';
import FormVehicleFields from './FormVehicleFields';
import FormMachineryFields from './FormMachineryFields';
import FormMarketStallsFields from './FormMarketStallsFields';
import FormOthersFields from './FormOthersFields';
import {createStyles} from './styles';
import {Theme} from '../../theme/colors';
import {StackNavigationProp} from '@react-navigation/stack';
import {RootStackParamList} from '../../navigators/RootNavigator';
import FormLandAndImprove from './FormLandAndImprove';

export interface FormAssetCollateralProps {
  theme: Theme;
  appId: string;
  navigation: StackNavigationProp<RootStackParamList>;
}

const FormAssetCollateral: React.FC<FormAssetCollateralProps> = ({
  theme,
  appId,
  navigation,
}) => {
  const [assetType, setAssetType] = useState<AssetType | null>('VEHICLE');
  const [isLoading, setIsLoading] = useState(true);
  const styles = createStyles(theme);

  // Add onSuccess function that can be passed to child components
  const onSuccess = () => {
    console.log('Asset added successfully');
    // Additional success handling if needed
  };

  useEffect(() => {
    const fetchAssetType = async () => {
      try {
        const response = await getApprovalProcess(appId);
        if (!response) return;

        const filterResponse = response.filter(
          item => item.type === 'CREATE_LOAN_REQUEST',
        );

        if (
          filterResponse.length > 0 &&
          filterResponse[0].metadata.loanCollateralTypes?.length
        ) {
          setAssetType(
            filterResponse[0].metadata.loanCollateralTypes[0] as AssetType,
          );
        }
      } catch (error) {
        console.error('Error fetching asset type:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAssetType();
  }, [appId]);

  const renderForm = () => {
    if (isLoading) {
      return <ActivityIndicator size="large" color={theme.buttonSubmit} />;
    }

    switch (assetType) {
      case 'LAND':
        return (
          <FormLandFields theme={theme} appId={appId} navigation={navigation} />
        );
      case 'APARTMENT':
        return (
          <FormApartmentFields
            theme={theme}
            appId={appId}
            navigation={navigation}
          />
        );
      case 'VEHICLE':
        return (
          <FormVehicleFields
            theme={theme}
            appId={appId}
            navigation={navigation}
          />
        );
      case 'MACHINERY':
        return (
          <FormMachineryFields
            theme={theme}
            appId={appId}
            navigation={navigation}
          />
        );
      case 'MARKET_STALLS':
        return (
          <FormMarketStallsFields
            theme={theme}
            appId={appId}
            navigation={navigation}
          />
        );
      case 'LAND_AND_IMPROVEMENT':
        return (
          <FormLandAndImprove
            theme={theme}
            appId={appId}
            navigation={navigation}
          />
        );
      case 'OTHER':
        return (
          <FormOthersFields
            theme={theme}
            appId={appId}
            onSuccess={onSuccess}
            navigation={navigation}
          />
        );
      default:
        return null;
    }
  };

  return <View style={styles.container}>{renderForm()}</View>;
};

export default FormAssetCollateral;
