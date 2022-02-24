import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { setString as cb } from 'expo-clipboard';
import { Button, Box, Input, NativeBaseProvider, Text, TextInput, TouchableOpacity, VStack } from 'native-base';
import axios from 'axios';

export default function App() {
  const [ urlSubmitted, setUrlSubmitted ] = useState('');
  const [ tUrl, setTUrl ] = useState('');
  const [ showBtn, setShowBtn ] = useState(false);
  const { control, handleSubmit, formState: {errors, isValid}, reset } = useForm({mode: 'onBlur'});
  const onSubmit = data => {
    setUrlSubmitted(data.inputUrl);
  };

  useEffect(() => {
    if (urlSubmitted !== '') {
      const fetch = async () => {
        try {
          await axios.post('https://api.tinyurl.com/create', 
            {
              'url': urlSubmitted
            },
            {
              headers: {
                Accept: 'application/json',
                Authorization: 'Bearer <token>',
                'Content-Type': 'application/json'
              }
            }
          ).then((response) => {
            setTUrl(response.data.data.tiny_url);
            setShowBtn(true);
          })
        } catch (e) {
          console.error(e.message);
        }
      }
      fetch();
    } else {
      setTUrl('');
      setShowBtn(false);
    }
  });

  return (
    <NativeBaseProvider>
      <VStack flex={1} bg="white" space='2' alignItems='center'>
        <Box marginTop='12%'>
          <Text fontSize='2xl'>url-shortener.js</Text>
        </Box>
        <Box w='90%' justifyContent='space-between'>
          <VStack space={4}>
            <Controller
              control={control}
              name='inputUrl'
              render={({field: {onChange, value, onBlur}}) => (
                <Input
                  size='md'
                  placeholder='Enter your url here'
                  value={value}
                  onblur={onBlur}
                  onChangeText={value => onChange(value)}
                  keyboardType='email-address'
                  onEndEditing={handleSubmit(onSubmit)}
                />
              )}
            />
            <Button size='lg' onPress={handleSubmit(onSubmit)}>Submit</Button>
            {
              showBtn ? (
                <VStack space={2}>
                  <Button size='md' colorScheme='green' onPress={() => {cb(tUrl)}}>{tUrl}</Button>
                  <Button size='md' colorScheme='red' onPress={() => {
                    setUrlSubmitted('')
                    setTUrl('');
                    setShowBtn(false);
                    reset({
                      inputUrl: ''
                    });
                  }}>Clear</Button>
                </VStack>
              ) : null
            }
          </VStack>
          <StatusBar style="auto" />
        </Box>
      </VStack>
    </NativeBaseProvider>
  );
}
