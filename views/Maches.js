import React, {useEffect, useState} from 'react';
import {AsyncStorage, View, Text, Button, StyleSheet} from 'react-native';
import Match from './Match';

const Matches = props => {
  const [token, setToken] = useState('');
  const [matches, setMatches] = useState([]);
  useEffect(() => {}, []);
  const updateToken = () => {};
  const _retrieveToken = async () => {
    try {
      const value = await AsyncStorage.getItem('token');
      // console.log(value);
      // console.log('end of the outside');
      if (value !== null) {
        // console.log('start of the inside');
        // console.log(value);
        return value;
      }
    } catch (error) {
      // Error retrieving data
      console.log("Couldn't retrieve token");
    }
  };

  const loadMatches = async () => {
    const token = await _retrieveToken();
    setToken(token);
    console.log(token);
    fetch('http://fauques.freeboxos.fr:3000/matches', {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
    })
      .then(res => {
        console.log('matches');

        return res.json();
      })
      .then(res => {
        console.log('all matches');
        console.log(res);
        setMatches(res);
      })
      .catch(err => console.log(err));
  };

  const getMatch = async () => {
    const id = '61b1f6161053fe731065b9f3';

    const token = await _retrieveToken();
    fetch(
      'http://fauques.freeboxos.fr:3000/matches/' + id,

      {
        method: 'GET',
        headers: {
          'Content-type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
      },
    )
      .then(res => {
        console.log('match res');
        return res.json();
      })
      .then(res => {
        console.log('current match');
        console.log(res);
      })
      .catch(err => console.log(err));
  };

  const newMatch = async () => {
    const token = await _retrieveToken();
    fetch('http://fauques.freeboxos.fr:3000/matches', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
    })
      .then(res => {
        console.log('post response');
        console.log(res);
        return res.json();
      })
      .then(res => {
        console.log('post body');
        console.log(res);
      })
      .catch(err => console.log(err));
  };

  return (
    <View>
      {/* <Text>{token}</Text> */}
      <View style={styles.buttonContainer}>
        <Button onPress={loadMatches} title="load matches" />
        <Button onPress={newMatch} title="new match" />
        <Button onPress={getMatch} title="get match" />
      </View>
      <Text>Matches</Text>
      {matches.map(match => (
        <Match
          id={match._id}
          turns={match.turns}
          user1={match.user1}
          user2={match.user2}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
});

export default Matches;
