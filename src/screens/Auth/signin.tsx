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
import {t} from 'i18next';
import {RFValue} from 'react-native-responsive-fontsize';
import CheckBox from '@react-native-community/checkbox';
import Feather from 'react-native-vector-icons/Feather';
import {Formik} from 'formik';
import * as Yup from 'yup';
import {colors} from '../../utilities/constants';
import {Typography} from '../../utilities/constants/constant.style';
import Images from '../../assets/images';
import screenResolution from '../../utilities/constants/screenResolution';
import CTAButton1 from '../../components/CTA_BUTTON1';

const validationSchema = Yup.object().shape({
  email: Yup.string().email(t('invalidEmail')).required(t('emailRequired')),
  password: Yup.string()
    .min(6, t('passwordMin'))
    .required(t('passwordRequired')),
});

interface SignInProps {
  navigation: any;
}

const SignIn: React.FC<SignInProps> = ({navigation}) => {
  const dispatch = useDispatch();
  const styles = createStyles(colors);
  const [isSelectedRemember, setisSelectedRemember] = useState<boolean>(false);
  const [secureEntryState, setsecureEntryState] = useState<boolean>(true);

  // const submit = (values: {email: string; password: string}) => {
  //   let credentials = {
  //     email: values.email,
  //     password: values.password,
  //   };
  //   // dispatch(loginUser(credentials, isSelectedRemember, navigation));
  // };

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
              Typography.f_14_poppins_medium,
              {marginTop: 20, color: colors.Primary_01},
            ]}>
            {t('welcomeBack')}
          </Text>
          <Text
            style={[
              Typography.f_14_poppins_medium,
              {marginTop: 5, color: colors.Primary_01},
            ]}>
            {t('pleaseLoginHere')}
          </Text>
          <Formik
            initialValues={{email: '', password: ''}}
            // validationSchema={validationSchema}
            // onSubmit={submit}
            onSubmit={()=>navigation.navigate('Tabs')}
            >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              errors,
              touched,
            }) => (
              <View style={styles.containerc1_c2}>
                <View>
                  <View style={{flexDirection: 'row'}}>
                    <Text
                      style={[
                        {top: 3, color: colors.Primary_01},
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

                <View style={{marginTop: 10}}>
                  <View style={{flexDirection: 'row'}}>
                    <Text
                      style={[
                        {top: 3, color: colors.Primary_01},
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
                      onPress={() => {
                        setsecureEntryState(!secureEntryState);
                      }}>
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

                <View style={styles.checkboxContainer}>
                  <View
                    style={{
                      flex: 1,
                      alignItems: 'center',
                      flexDirection: 'row',
                    }}>
                    <CheckBox
                      tintColors={{
                        true: colors.Primary_01,
                        false: colors.Neutral_01,
                      }}
                      disabled={false}
                      value={isSelectedRemember}
                      onValueChange={setisSelectedRemember}
                    />
                    <Text
                      style={[
                        styles.label,
                        Typography.f_14_poppins_medium,
                        {textAlign: 'left'},
                      ]}>
                      {t('rememberme')}
                    </Text>
                  </View>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    style={{
                      flex: 1,
                      flexDirection: 'row',
                      flexWrap: 'wrap',
                      justifyContent: 'flex-end',
                    }}>
                    <Text
                      style={[
                        Typography.f_14_poppins_medium,
                        {textAlign: 'right', color: colors.Primary_01},
                      ]}
                      onPress={() => navigation.navigate('ForgotPassword')}>
                      {t('forgotPassword')}
                    </Text>
                  </TouchableOpacity>
                </View>

                <View style={{marginTop: 10}}>
                  <CTAButton1
                    title={t('signIn')}
                    submitHandler={handleSubmit}
                  />
                </View>
              </View>
            )}
          </Formik>

          <View style={styles.containerc1_c3}>
            <TouchableOpacity
              style={styles.socialText}
              onPress={() => navigation.navigate('Signup')}>
              <Text
                style={[
                  styles.socialTextC1,
                  Typography.f_14_poppins_medium,
                  {color: colors.Primary_01},
                ]}>
                {t('donthaveaccount')}{' '}
              </Text>
              <Text
                style={[
                  styles.socialTextC1,
                  Typography.f_14_poppins_bold,
                  {color: colors.Primary_01},
                ]}>
                {t('signup')}
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
    text: {
      fontWeight: '700',
      fontSize: RFValue(24, screenResolution.screenHeight),
      lineHeight: 32,
      letterSpacing: -0.3,
      color: colors.black,
    },
    label: {
      color: colors.black,
    },
    containerc1_c1: {
      width: '100%',
      justifyContent: 'center',
      alignItems: 'center',
    },
    containerc1_c2: {
      width: '100%',
      marginTop: 20,
    },
    containerc1_c3: {
      width: '100%',
      justifyContent: 'flex-end',
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
    socialText: {
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'row',
    },
    socialTextC1: {
      lineHeight: 38,
      letterSpacing: -0.3,
      color: colors.Neutral_01,
      textAlign: 'center',
      ...Typography.f_16_poppins_regular,
    },
    checkboxContainer: {
      marginTop: 5,
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
    },
  });
};

export default SignIn;
