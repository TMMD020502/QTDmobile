import React, {ReactNode} from 'react';
import {TouchableWithoutFeedback, Keyboard, View} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

interface KeyboardWrapperProps {
  children: ReactNode;
}

const KeyboardWrapper: React.FC<KeyboardWrapperProps> = ({children}) => {
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={{flex: 1}}>
        <KeyboardAwareScrollView
          extraScrollHeight={50}
          enableOnAndroid={true}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{flexGrow: 1}}>
          {children}
        </KeyboardAwareScrollView>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default KeyboardWrapper;
