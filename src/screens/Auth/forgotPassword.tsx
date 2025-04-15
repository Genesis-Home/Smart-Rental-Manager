import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import {t} from 'i18next';
import * as Yup from 'yup';
import {Formik, FormikProps} from 'formik';
// local imports
import Images from '../../assets/images';
import {BackIcon} from '../../assets/icons';
import {Typography} from '../../utilities/constants/constant.style';
import {colors} from '../../utilities/constants';
import CTAButton1 from '../../components/CTA_BUTTON1';

interface FormValues {
  email: string;
}

const ForgotPassword: React.FC<{navigation: any}> = ({navigation}) => {
  const styles = createStyles(colors);

  const validationSchema = Yup.object().shape({
    email: Yup.string().email(t('invalidEmail')).required(t('emailRequired')),
  });

  const submit = (values: FormValues) => {
    // Dispatch the forgot password action
    // dispatch(forgotPassword(values.email));
    // Navigate to ResetPassword screen (as per original code)
    navigation.navigate('ResetPassword');
  };

  return (
    <View
      style={[
        styles.mainContainer,
        {marginTop: Platform.OS === 'ios' ? 50 : 0},
      ]}>
      <View
        style={{
          height: 200,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: colors.Primary_01,
        }}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          activeOpacity={0.8}
          style={{position: 'absolute', left: 20, top: 20}}>
          <BackIcon />
        </TouchableOpacity>
        <View style={styles.containerc1_c1}>
          <Image
            resizeMode="contain"
            style={{width: 250, height: 120}}
            source={Images.Logo}
          />
        </View>
      </View>

      <View style={{flex: 8}}>
        <ScrollView contentContainerStyle={styles.containerC1}>
          <Text
            style={[
              Typography.f_14_poppins_bold,
              {marginTop: 20, color: colors.Primary_01},
            ]}>
            {t('resetyourpassword')}
          </Text>
          <Text
            style={[
              Typography.f_14_poppins_medium,
              {marginTop: 5, color: colors.Primary_01},
            ]}>
            {t('enteryouremail')}
          </Text>

          <Formik
            initialValues={{email: ''}}
            validationSchema={validationSchema}
            onSubmit={submit}>
            {({
              values,
              handleChange,
              handleBlur,
              handleSubmit,
              errors,
              touched,
            }: FormikProps<FormValues>) => (
              <View style={styles.containerc1_c2}>
                <View>
                  <View style={{flexDirection: 'row'}}>
                    <Text
                      style={[
                        {top: 3, color: colors.black},
                        Typography.f_14_poppins_medium,
                      ]}>
                      {t('emailAddress')}
                    </Text>
                  </View>
                  <View style={styles.inputContiner}>
                    <TextInput
                      style={styles.input}
                      value={values.email}
                      onChangeText={handleChange('email')}
                      onBlur={handleBlur('email')}
                      placeholder={t('email')}
                      placeholderTextColor={colors.Neutral_01}
                    />
                  </View>
                  {touched.email && errors.email && (
                    <Text
                      style={[
                        Typography.f_14_poppins_medium,
                        {color: colors.Error_Red},
                      ]}>
                      {errors.email}
                    </Text>
                  )}
                </View>

                <View style={{marginTop: 20}}>
                  <CTAButton1
                    title={t('sendOtp')}
                    submitHandler={handleSubmit}
                  />
                </View>
              </View>
            )}
          </Formik>

          <View style={styles.containerc1_c3}>
            <TouchableOpacity
              style={styles.socialText}
              onPress={() => navigation.navigate('Signin')}>
              <Text
                style={[
                  styles.socialTextC1,
                  Typography.f_14_poppins_medium,
                  {color: colors.Primary_01},
                ]}>
                {t('rememberyourpassword')}{' '}
              </Text>
              <Text
                style={[
                  styles.socialTextC1,
                  Typography.f_14_poppins_bold,
                  {color: colors.Primary_01},
                ]}>
                {' '}
                {t('signIn')}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

const createStyles = (colors: any) => {
  return StyleSheet.create({
    mainContainer: {
      flex: 1,
      backgroundColor: colors.white,
    },
    containerC1: {
      alignItems: 'center',
      justifyContent: 'center',
      marginHorizontal: '10%',
      paddingBottom: 50,
    },
    containerc1_c1: {
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
    },
    containerc1_c2: {
      marginTop: 20,
      width: '100%',
    },
    containerc1_c3: {
      marginTop: 10,
      width: '100%',
      justifyContent: 'flex-end',
    },
    inputContiner: {
      borderColor: colors.Primary_01,
      borderRadius: 5,
      borderWidth: 1,
      marginTop: 10,
    },
    input: {
      height: 50,
      width: '90%',
      color: colors.black,
      marginLeft: 7,
      ...Typography.f_14_poppins_medium,
    },
    socialText: {
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
    },
    socialTextC1: {
      letterSpacing: -0.3,
      color: colors.Neutral_01,
      textAlign: 'center',
    },
  });
};

export default ForgotPassword;
