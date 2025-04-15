import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  View,
  ViewStyle,
  TextStyle,
} from 'react-native';
import {useSelector} from 'react-redux';
// local import
import {Typography} from '../utilities/constants/constant.style';
import {colors} from '../utilities/constants';

interface CTAButton1Props {
  title: string;
  submitHandler: () => void;
  icon?: React.ReactNode;
}

const CTAButton1: React.FC<CTAButton1Props> = ({
  title,
  submitHandler,
  icon,
}) => {
  const styles = createStyles(colors);
  const isLoader = useSelector((state: any) => state.reducer.isLoader); 

  return (
    <TouchableOpacity
      onPress={submitHandler}
      activeOpacity={0.8}
      style={styles.CRAButton1}>
      {!isLoader ? (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          {icon && icon}
          <Text style={[styles.CRAButton1_Text, Typography.f_16_poppins_bold]}>
            {title}
          </Text>
        </View>
      ) : (
        <ActivityIndicator color={'white'} />
      )}
    </TouchableOpacity>
  );
};

export default CTAButton1;

const createStyles = (
  colors: any,
): {CRAButton1: ViewStyle; CRAButton1_Text: TextStyle} => {
  return StyleSheet.create({
    CRAButton1: {
      backgroundColor: colors.Primary_01,
      borderRadius: 5,
      height: 50,
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
    },
    CRAButton1_Text: {
      textAlign: 'center',
      color: colors.white,
    },
  });
};
