import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { setString as cb } from 'expo-clipboard';
import { Button, Box, Input, NativeBaseProvider, StatusBar, Text, VStack } from 'native-base';
import axios from 'axios';

export default function App() {
  const [ urlList, setUrlList ] = useState([]);
  const [ urlSubmitted, setUrlSubmitted ] = useState('');
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
                Authorization: 'Bearer XxlEynmrIYt660DKP81LlDcd19YkV0wjxzp4tjSQdKuNHUOCtWSUWtYa8L41',
                'Content-Type': 'application/json'
              }
            }
          ).then((response) => {
            const newUrlList = urlList.slice();
            newUrlList.push(response.data.data.tiny_url);
            setUrlList(newUrlList);
            setShowBtn(true);
          })
        } catch (e) {
          console.error(e.message);
        }
      }
      fetch();
    } else {
      setShowBtn(false);
    }
  }, [urlSubmitted]);

  return (
    <NativeBaseProvider>
      <VStack height='full' alignItems='center'>
        <Box width='100%' alignItems='center' bg='black'>
          <Text marginTop='3%' fontSize='2xl' color='white' padding='2'>url-shortener.js</Text>
        </Box>
        <VStack flex={1} w='100%' alignItems='center' bg='#2C2F33' space={2}>
          <Box w='90%' justifyContent='space-between' marginTop='2%'>
            <VStack space={2}>
              <Controller
                control={control}
                name='inputUrl'
                render={({field: {onChange, value, onBlur}}) => (
                  <Input
                    size='md'
                    borderColor='coolGray.500'
                    placeholder='Enter your url here'
                    value={value}
                    onblur={onBlur}
                    onChangeText={value => onChange(value)}
                    keyboardType='email-address'
                    onEndEditing={handleSubmit(onSubmit)}
                  />
                )}
              />
              <VStack space={2}>
                <Button size='lg' onPress={handleSubmit(onSubmit)}>Submit</Button>
                {
                  showBtn ? (
                      <Button size='lg' colorScheme='red' onPress={() => {
                        setUrlSubmitted('')
                        setUrlList([]);
                        setShowBtn(false);
                        reset({
                          inputUrl: ''
                        });
                      }}>Clear</Button>
                  ) : null
                }
              </VStack>
            </VStack>
            <StatusBar barStyle='light-content'/>
          </Box>
          <Box flex={1} width='90%' borderWidth='1' borderColor='coolGray.500' rounded='lg' alignItems='center' marginBottom='5%'>
            <VStack width="98%" space={2} padding={2}>
              {
                  urlList.map((url, i) => {
                    return <Button size='md' colorScheme='green' onPress={() => {cb(url)}} key={i}>{url}</Button>
                  })
              }
            </VStack>
          </Box>
        </VStack>
      </VStack>
    </NativeBaseProvider>
  );
}
