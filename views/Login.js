import {Button, StyleSheet, Text, View} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import {TextInput} from 'react-native-gesture-handler';
import Context from '../Context';

const Login = ({navigation}) => {
  const [username, setUsername] = useState('');
  const [token, setToken] = useState('');
  const {user, setUser} = useContext(Context);
  const handleChange = value => {
    setUsername(value);
  };
  useEffect(() => {}, [token]);
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
          const token = res.token;
          setUser({username: username, token: res.token});
          const _storeData = async () => {
            try {
              setToken(token);
            } catch (error) {}
          };

          _storeData();
          navigation.navigate('Matches');
        })
        .catch(err => console.log(err));
    }
  };
  return (
    <View>
      {/* {user && (
        <Text>
          Current user {user.username} - token {user.token}
        </Text>
      )} */}
      <TextInput
        style={styles.input}
        underlineColorAndroid="transparent"
        placeholder="Username"
        // placeholderTextColor="#000"
        autoCapitalize="none"
        onChangeText={handleChange}
      />
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
