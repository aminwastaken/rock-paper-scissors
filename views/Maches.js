import React, {useContext, useEffect, useState} from 'react';
import {
  AsyncStorage,
  View,
  Text,
  Button,
  StyleSheet,
  ScrollView,
} from 'react-native';
import Match from '../components/Match';
import Toast from 'react-native-toast-message';
import {useIsDrawerOpen} from '@react-navigation/drawer';
import CardContainer from '../components/CardContainer';
import {Picker} from '@react-native-picker/picker';
import Context from '../Context';

const Matches = props => {
  const [matches, setMatches] = useState([]);
  const [matchId, setMatchId] = useState(undefined);
  const [currentMatch, setCurrentMatch] = useState(undefined);
  const [username, setUsername] = useState(undefined);
  const [currentMove, setCurrentMove] = useState('rock');
  const [currentTurn, setCurrentTurn] = useState(1);
  const {user, setUser} = useContext(Context);
  const options = ['rock', 'paper', 'scissors'];

  useEffect(async () => {
    getMatch();
    loadMatches();
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

  const _retrieveMatchId = async () => {
    try {
      const value = await AsyncStorage.getItem('matchId');
      if (value !== null) {
        return value;
      }
    } catch (error) {
      // Error retrieving data
      console.log("Couldn't retrieve match id");
    }
  };

  const loadMatches = async () => {
    const token = await _retrieveToken();
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

  const getMatch = async () => {
    const id = await _retrieveMatchId();
    console.log('match id: ' + id);
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
        console.log(res.match);
        if (res._id) {
          const _storeMatchId = async () => {
            try {
              setMatchId(res._id);
              await AsyncStorage.setItem('matchId', res._id);
            } catch (error) {}
          };
          _storeMatchId();
        }
      })
      .catch(err => console.log(err));
  };

  const playTurn = async () => {
    const token = await _retrieveToken();
    fetch(
      `http://fauques.freeboxos.fr:3000/matches/${matchId}/turns/${currentTurn}`,
      {
        method: 'POST',
        headers: {
          'Content-type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
        body: JSON.stringify({move: currentMove}),
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

        getMatch();
        loadMatches();
      })
      .catch(err => console.log(err));
  };

  const selectOption = move => {
    console.log('pressed');
    setCurrentMove(move);
  };

  return (
    <ScrollView style={styles.mainContainer}>
      {/* <Text>{token}</Text> */}
      <View style={styles.userView}>
        <Text>Current user: </Text>
        <Text>{user.username}</Text>
      </View>
      <View style={styles.userView}>
        <Text>Current match id: </Text>
        <Text>{matchId}</Text>
      </View>
      <View style={styles.buttonContainer}>
        <Button onPress={loadMatches} title="load matches" />
        <Button onPress={newMatch} title="new match" />
        <Button onPress={getMatch} title="get match" />
      </View>

      <CardContainer
        options={['rock', 'paper', 'scissors']}
        selected={currentMove}
        selectOption={selectOption}
      />

      <View>
        <Picker
          selectedValue={currentTurn}
          style={{height: 50, backgroundColor: 'white'}}
          onValueChange={(itemValue, itemIndex) => setCurrentTurn(itemValue)}>
          <Picker.Item label="First turn" value={1} />
          <Picker.Item label="Second turn" value={2} />
          <Picker.Item label="Third turn" value={3} />
        </Picker>
      </View>
      <Text>{currentTurn}</Text>
      <View style={styles.buttonContainer}>
        <Button onPress={() => playTurn()} title="play turn" />
      </View>
      <Text style={styles.title}>Current match</Text>
      {currentMatch && (
        <Match
          id={currentMatch._id}
          turns={currentMatch.turns}
          user1={currentMatch.user1}
          user2={currentMatch.user2}
        />
      )}

      <Text style={styles.title}>All matches</Text>
      {matches.map(match => (
        <Match
          id={match._id}
          turns={match.turns}
          user1={match.user1}
          user2={match.user2}
        />
      ))}
      <Toast />
    </ScrollView>
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

  title: {
    fontSize: 20,
    color: 'white',
  },
});

export default Matches;
