import {Button, StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import {TextInput} from 'react-native-gesture-handler';
import {AsyncStorage} from 'react-native';

const Login = () => {
  const [username, setUsername] = useState('');
  const handleChange = value => {
    setUsername(value);
  };
  const submit = async () => {
    if (username && username !== '') {
      fetch('http://fauques.freeboxos.fr:3000/login', {
        method: 'POST',
        body: JSON.stringify({username: username}),
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then(function (res) {
          return res.json();
        })
        .then(res => {
          // SyncStorage.set("token", res);
          const token = res.token;
          // console.log(token);
          // console.log(typeof token);
          const _storeData = async () => {
            try {
              // console.log('here');
              await AsyncStorage.setItem('token', token);
            } catch (error) {}
          };

          _storeData();
        })
        .catch(err => console.log(err));
    }
  };
  return (
    <View>
      <TextInput
        style={styles.input}
        underlineColorAndroid="transparent"
        placeholder="Username"
        // placeholderTextColor="#000"
        autoCapitalize="none"
        onChangeText={handleChange}
      />
      <Text>{username}</Text>
      <Button
        style={styles.button}
        onPress={submit}
        title="Submit"
        color="blue"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});
export default Login;
