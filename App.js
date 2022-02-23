import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, TextInput, View } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { setString as cb } from 'expo-clipboard';
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
    <View style={styles.container}>
      <Text style={styles.header}>url-shortener.js</Text>
      <Controller
        control={control}
        name='inputUrl'
        render={({field: {onChange, value, onBlur}}) => (
          <TextInput
            style={styles.inputURL}
            placeholder='Enter your url here'
            value={value}
            onblur={onBlur}
            onChangeText={value => onChange(value)}
            keyboardType='email-address'
            onEndEditing={handleSubmit(onSubmit)}
          />
        )}
      />
      <Button title='Submit' onPress={handleSubmit(onSubmit)}/>
      {
        showBtn ? (
          <View>
          <TouchableOpacity style={styles.shortUrlButton} onPress={() => {cb(tUrl)}}>
            <Text style={styles.shortUrlButtonText}>{tUrl}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.shortUrlButton} onPress={() => {
            setUrlSubmitted('')
            setTUrl('');
            setShowBtn(false);
            reset({
              inputUrl: ''
            });
          }}>
            <Text style={styles.shortUrlButtonText}>Clear</Text>
          </TouchableOpacity>
          </View>
        ) : null
      }
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 48,
    marginLeft: 10,
    marginRight: 10,
    backgroundColor: '#fff',
  },
  header: {
    textAlign: 'center',
    fontSize: 30,
  },
  inputURL: {
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 4,
    margin: 10,
    paddingTop: 5,
    paddingLeft: 10,
    paddingBottom: 5,
    fontSize: 20
  },
  screen: {
    paddingTop: 70,
    paddingHorizontal: 70,
  },
  shortUrlButton: {
    borderWidth: 2,
    backgroundColor: 'blue',
    marginTop: 10,
    padding: 5,
    borderRadius: 20,
  },
  shortUrlButtonText: {
    fontSize: 20,
    textAlign: 'center',
    color: '#fff'
  }
});
