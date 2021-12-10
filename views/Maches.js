import React, {useEffect, useState} from 'react';
import {AsyncStorage, View, Text, Button, StyleSheet} from 'react-native';
import Match from './Match';
import Toast from 'react-native-toast-message';
import {useIsDrawerOpen} from '@react-navigation/drawer';

const Matches = props => {
  const [token, setToken] = useState('');
  const [matches, setMatches] = useState([]);
  const [currentMatch, setCurrentMatch] = useState(undefined);
  const [username, setUsername] = useState(undefined);
  const isOpen = useIsDrawerOpen;

  useEffect(async () => {
    getMatch();
    loadMatches();
    const username = await _retrieveUsername();
    setUsername(username);
  }, []);
  const updateToken = () => {};
  const _retrieveToken = async () => {
    try {
      const value = await AsyncStorage.getItem('token');
      if (value !== null) {
        return value;
      }
    } catch (error) {
      // Error retrieving data
      console.log("Couldn't retrieve token");
    }
  };

  const _retrieveUsername = async () => {
    try {
      const value = await AsyncStorage.getItem('username');
      if (value !== null) {
        return value;
      }
    } catch (error) {
      // Error retrieving data
      console.log("Couldn't retrieve token");
    }
  };

  const loadMatches = async () => {
    console.log('props start');
    console.log(props);
    console.log('props end');
    console.log(props.navigation.isFocused());
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
        console.log('turns');
        console.log(res[0].turns);

        setMatches(res);
      })
      .catch(err => console.log(err));
  };

  // const postMatches = async () => {
  //   const token = await _retrieveToken();
  //   setToken(token);
  //   console.log(token);
  //   fetch('http://fauques.freeboxos.fr:3000/matches', {
  //     method: 'POST',
  //     headers: {
  //       'Content-type': 'application/json',
  //       Authorization: 'Bearer ' + token,
  //     },
  //   })
  //     .then(res => {
  //       console.log('current match (post request)');
  //       return res.json();
  //     })
  //     .then(res => {
  //       console.log('current match body (post request)');
  //       console.log(res);
  //     })
  //     .catch(err => console.log(err));
  // };

  const getMatch = async matchId => {
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
        setCurrentMatch(res);
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

  const playTurn = async (matchId, turnId) => {
    const token = await _retrieveToken();
    fetch(
      `http://fauques.freeboxos.fr:3000/matches/${matchId}/turns/${turnId}`,
      {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
        body: JSON.stringify({move: 'paper'}),
      },
    )
      .then(res => {
        console.log('turn response');
        console.log(res);
        return res.json();
      })
      .then(res => {
        console.log('turn response body');
        console.log(res);
        if (res) {
          const resKeys = Object.keys(res);
          Toast.show({
            text1: resKeys[0],
            text2: res[resKeys[0]],
            position: 'bottom',
          });
        }
      })
      .catch(err => console.log(err));
  };

  return (
    <View style={styles.mainContainer}>
      {/* <Text>{token}</Text> */}
      <View style={styles.userView}>
        <Text>Current user: </Text>
        <Text>{username}</Text>
      </View>
      <View style={styles.buttonContainer}>
        <Button onPress={loadMatches} title="load matches" />
        <Button onPress={newMatch} title="new match" />
        <Button onPress={getMatch} title="get match" />
      </View>
      <View style={styles.buttonContainer}>
        <Button
          onPress={() => playTurn('61b1f6161053fe731065b9f3', 2)}
          title="play turn"
        />
      </View>
      <Text>Current match</Text>
      {currentMatch && (
        <Match
          id={currentMatch._id}
          turns={currentMatch.turns}
          user1={currentMatch.user1}
          user2={currentMatch.user2}
        />
      )}

      <Text>All matches</Text>
      {matches.map(match => (
        <Match
          id={match._id}
          turns={match.turns}
          user1={match.user1}
          user2={match.user2}
        />
      ))}
      <Toast />
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  mainContainer: {
    height: '100%',
  },
  matches: {},
  userView: {
    flexDirection: 'row',
  },
});

export default Matches;
