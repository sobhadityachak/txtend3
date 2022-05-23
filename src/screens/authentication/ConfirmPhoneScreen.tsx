import React, {useState} from 'react';
import {View, Text, StyleSheet, ScrollView, Alert} from 'react-native';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
// import SocialSignInButtons from '../../components/SocialSignInButtons';
import {useNavigation} from '@react-navigation/core';
import {useForm} from 'react-hook-form';
import {useRoute} from '@react-navigation/native';
import {Auth} from 'aws-amplify';

const ConfirmEmailScreen = () => {
  const route = useRoute();
  const {control, handleSubmit, watch} = useForm({
    defaultValues: {
      username: route?.params?.username,
      password: route?.params?.password,
      },
  });

  const username = watch('username');

  const navigation = useNavigation();

  const onConfirmPressed = async data => {
    try {
      await Auth.confirmSignUp(data.username, data.code);

    Alert.alert("verfied","Congratulations Your are all Set!"); 
    } catch (e) {
      Alert.alert('Oops', e.message);
    }

    try {
      await Auth.signIn(data.username, data.password);
      navigation.goBack();
    } catch (error) {
      Alert.alert('Oops',error.message);
    }
  }; 

  const onSignInPress = () => {
    navigation.navigate('SignIn');
  };

  const onResendPress = async () => {
    try {
      await Auth.resendSignUp(username);
      Alert.alert('Success', 'Code was resent to your phone');
    } catch (e) {
      Alert.alert('Oops', e.message);
    }
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.root}>
        <Text style={styles.title}>Confirm your Phone number</Text>

        <CustomInput
          name="username"
          control={control}
          placeholder="Country Code + phone number"
          rules={{
            required: 'Phone number with country code is required',
          }} secureTextEntry={undefined}        />

        <CustomInput
          name="code"
          control={control}
          placeholder="Enter your confirmation code"
          rules={{
            required: 'Confirmation code is required',
          }} secureTextEntry={undefined}        />

        <CustomButton text="Confirm" onPress={handleSubmit(onConfirmPressed)} bgColor={undefined} fgColor={undefined} />

        <CustomButton
          text="Resend code"
          onPress={onResendPress}
          type="SECONDARY" bgColor={undefined} fgColor={undefined}        />

        <CustomButton
          text="Back to Sign in"
          onPress={onSignInPress}
          type="TERTIARY" bgColor={undefined} fgColor={undefined}        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#051C60',
    margin: 10,
  },
  text: {
    color: 'gray',
    marginVertical: 10,
  },
  link: {
    color: '#FDB075',
  },
});

export default ConfirmEmailScreen;
