import React, {useEffect, useState} from 'react';
import {AsyncStorage, View, Text, Button} from 'react-native';

const Matches = () => {
  const [token, setToken] = useState('');

  useEffect(() => {
    const _retrieveToken = async () => {
      try {
        const value = await AsyncStorage.getItem(token);
        if (value !== null) {
          console.log(value);
          setToken(value);
        }
      } catch (error) {
        // Error retrieving data
        console.log("Couldn't retrieve token");
      }
    };
    _retrieveToken();
  }, []);

  const updateToken = () => {
    const _retrieveToken = async () => {
      try {
        const value = await AsyncStorage.getItem('token');
        console.log(value);
        console.log('end of the outside');
        if (value !== null) {
          console.log('start of the inside');
          console.log(value);
          setToken(value);
        }
      } catch (error) {
        // Error retrieving data
        console.log("Couldn't retrieve token");
      }
    };
    _retrieveToken();
  };

  return (
    <View>
      <Text>Matches</Text>
      <Text>{token}</Text>
      <Button onPress={updateToken} title="heey" />
    </View>
  );
};

export default Matches;
