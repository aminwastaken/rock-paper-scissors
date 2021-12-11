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

const Game = ({route, navigation}) => {
  const [currentMatch, setCurrentMatch] = useState(undefined);
  const [currentMove, setCurrentMove] = useState('rock');
  const [currentTurn, setCurrentTurn] = useState(1);
  const {gameId} = route.params;
  const {
    user: {username, token},
    setUser,
  } = useContext(Context);
  const options = ['rock', 'paper', 'scissors'];

  useEffect(() => {
    getMatch();
  }, [gameId, currentMatch]);

  const getMatch = async () => {
    console.log('match id: ' + gameId);
    fetch(
      'http://fauques.freeboxos.fr:3000/matches/' + gameId,

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

  const playTurn = async () => {
    fetch(
      `http://fauques.freeboxos.fr:3000/matches/${gameId}/turns/${currentTurn}`,
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
      <Text>{token}</Text>
      <View style={styles.userView}>
        <Text>Current user: </Text>
        <Text>{username}</Text>
      </View>
      <View style={styles.userView}>
        <Text>Current move: </Text>
        <Text>{currentMove}</Text>
      </View>
      <View style={styles.userView}>
        <Text>Current match id: </Text>
        <Text>{gameId}</Text>
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

export default Game;
