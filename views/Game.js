import React, {useContext, useEffect, useState, useMemo} from 'react';
import {View, Text, Button, StyleSheet, ScrollView} from 'react-native';
import Match from '../components/Match';
import Toast from 'react-native-toast-message';
import CardContainer from '../components/CardContainer';
import {Picker} from '@react-native-picker/picker';
import Context from '../Context';
import EventSource from 'react-native-sse';

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

  useMemo(() => {
    console.log(gameId);
    const es = new EventSource(
      `http://fauques.freeboxos.fr:3000/matches/${gameId}/subscribe`,
      {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      },
    );

    es.addEventListener('open', event => {
      console.log('Open SSE connection.');
    });

    es.addEventListener('message', event => {
      console.log('New message event:');
      console.log(event.data);
      if (event.data[0]) {
        if (event.data[0]?.type === 'PLAYER1_JOIN') {
          Toast.show({
            text1: 'Your oponent has joined the game',
            position: 'bottom',
          });
        }
        if (event.data[0]?.type === 'NEW_TURN') {
          Toast.show({
            text1: 'New turn',
            position: 'bottom',
          });
        }
        if (event.data[0]?.type === 'TURN_ENDED') {
          const winner = event.data[0]?.payload?.winner;
          Toast.show({
            text1:
              winner === 'draw' ? "It's a draw" : winner + ' won this round',
            position: 'bottom',
          });
        }
        if (event.data[0]?.type === 'PLAYER1_MOVED') {
          Toast.show({
            text1: 'Your oponent has made a move',
            position: 'bottom',
          });
        }
        if (event.data[0]?.type === 'MATCH_ENDED') {
          const winner = event.data[0]?.payload?.winner;
          Toast.show({
            text1:
              winner === 'draw'
                ? "Game over: It's a draw"
                : winner + ' won the match',
            position: 'bottom',
          });
        }
      }
      getMatch();
    });

    es.addEventListener('error', event => {
      if (event.type === 'error') {
        console.error('Connection error:', event.message);
      } else if (event.type === 'exception') {
        console.error('Error:', event.message, event.error);
      }
    });

    es.addEventListener('close', event => {
      console.log('Close SSE connection.');
    });
  }, [gameId]);

  useEffect(() => {
    getMatch();
  }, [gameId, currentMove]);

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
        setCurrentMatch(res);
        setCurrentTurn(res.turns.length + 1);
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
      {/* <Text>{token}</Text> */}
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
        <Text>Please select a turn</Text>
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
