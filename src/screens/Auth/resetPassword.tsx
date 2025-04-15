import React, {useState} from 'react';
import {useDispatch} from 'react-redux';
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
import {RFValue} from 'react-native-responsive-fontsize';
import {t} from 'i18next';
import * as Yup from 'yup';
import {Formik, FormikHelpers} from 'formik';
// local imports
import Images from '../../assets/images';
import Feather from 'react-native-vector-icons/Feather';
import {BackIcon} from '../../assets/icons';
import {Typography} from '../../utilities/constants/constant.style';
import {colors} from '../../utilities/constants';
import screenResolution from '../../utilities/constants/screenResolution';
import CTAButton1 from '../../components/CTA_BUTTON1';

interface ResetPasswordValues {
  email: string;
  password: string;
  confirmPassword: string;
}

export default function ResetPassword({navigation}: {navigation: any}) {
  const dispatch = useDispatch();
  const styles = createStyles(colors);
  const [secureEntryState, setSecureEntryState] = useState<boolean>(true);
  const [secureEntryState1, setSecureEntryState1] = useState<boolean>(true);

  const validationSchema = Yup.object().shape({
    password: Yup.string()
      .required(t('passwordRequired'))
      .min(6, t('passwordMin')),
    confirmPassword: Yup.string()
      .required(t('confirmpasswordRequired'))
      .oneOf([Yup.ref('password')], t('passwordsDoNotMatch')),
  });

  const handleSubmit = (
    values: ResetPasswordValues,
    {resetForm}: FormikHelpers<ResetPasswordValues>,
  ) => {
    const credentials = {email: values.email, password: values.password};
    // Call your API or dispatch action here
    // dispatch(signIn(credentials));
    navigation.navigate('Signin');
    resetForm();
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
              Typography.f_16_poppins_bold,
              {marginTop: 20, color: colors.Primary_01},
            ]}>
            {t('changePassword')}
          </Text>
          <Text
            style={[
              Typography.f_14_poppins_medium,
              {marginTop: 5, color: colors.Primary_01},
            ]}>
            {t('enteryournewpassword')}
          </Text>

          <Formik
            initialValues={{email: '', password: '', confirmPassword: ''}}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}>
            {({
              values,
              handleChange,
              handleBlur,
              handleSubmit,
              errors,
              touched,
            }) => (
              <View style={styles.containerc1_c2}>
                <View>
                  <View style={{flexDirection: 'row'}}>
                    <Text
                      style={[
                        {top: 3, color: colors.black},
                        Typography.f_14_poppins_medium,
                      ]}>
                      {t('password')}
                    </Text>
                  </View>
                  <View style={styles.inputContiner}>
                    <TextInput
                      secureTextEntry={secureEntryState}
                      style={styles.input}
                      value={values.password}
                      onChangeText={handleChange('password')}
                      onBlur={handleBlur('password')}
                      placeholder={t('password')}
                      placeholderTextColor={colors.Neutral_01}
                    />
                    <TouchableOpacity
                      style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: '10%',
                      }}
                      activeOpacity={0.8}
                      onPress={() => setSecureEntryState(!secureEntryState)}>
                      <Feather
                        name={secureEntryState ? 'eye' : 'eye-off'}
                        style={{
                          fontSize: RFValue(20, screenResolution.screenHeight),
                          color: colors.white,
                        }}
                      />
                    </TouchableOpacity>
                  </View>
                  {touched.password && errors.password && (
                    <Text
                      style={[
                        Typography.f_14_poppins_medium,
                        {color: colors.Error_Red},
                      ]}>
                      {errors.password}
                    </Text>
                  )}
                </View>

                <View style={{marginTop: 10}}>
                  <View style={{flexDirection: 'row'}}>
                    <Text
                      style={[
                        {top: 3, color: colors.black},
                        Typography.f_14_poppins_medium,
                      ]}>
                      {t('confirmpassword')}
                    </Text>
                  </View>
                  <View style={styles.inputContiner}>
                    <TextInput
                      secureTextEntry={secureEntryState1}
                      style={styles.input}
                      value={values.confirmPassword}
                      onChangeText={handleChange('confirmPassword')}
                      onBlur={handleBlur('confirmPassword')}
                      placeholder={t('confirmpassword')}
                      placeholderTextColor={colors.Neutral_01}
                    />
                    <TouchableOpacity
                      style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: '10%',
                      }}
                      activeOpacity={0.8}
                      onPress={() => setSecureEntryState1(!secureEntryState1)}>
                      <Feather
                        name={secureEntryState1 ? 'eye' : 'eye-off'}
                        style={{
                          fontSize: RFValue(20, screenResolution.screenHeight),
                          color: colors.white,
                        }}
                      />
                    </TouchableOpacity>
                  </View>
                  {touched.confirmPassword && errors.confirmPassword && (
                    <Text
                      style={[
                        Typography.f_14_poppins_medium,
                        {color: colors.Error_Red},
                      ]}>
                      {errors.confirmPassword}
                    </Text>
                  )}
                </View>

                <View style={{marginTop: 20}}>
                  <CTAButton1 title={t('save')} submitHandler={handleSubmit} />
                </View>
              </View>
            )}
          </Formik>
        </ScrollView>
      </View>
    </View>
  );
}

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
    text: {
      fontWeight: '700',
      fontSize: RFValue(24, screenResolution.screenHeight),
      lineHeight: 32,
      letterSpacing: -0.3,
      color: colors.black,
    },
    containerc1_c1: {
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
    },
    containerc1_c2: {
      width: '100%',
    },
    inputContiner: {
      paddingHorizontal: 10,
      backgroundColor: colors.white,
      borderColor: colors.Primary_01,
      borderRadius: 5,
      borderWidth: 1,
      marginTop: 10,
      flexDirection: 'row',
      alignItems: 'center',
    },
    input: {
      height: 50,
      color: colors.black,
      width: '90%',
      ...Typography.f_14_poppins_medium,
    },
  });
};
