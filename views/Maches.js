import React, {useContext, useEffect, useMemo, useState} from 'react';
import {View, Text, Button, StyleSheet, ScrollView} from 'react-native';
import Match from '../components/Match';
import Toast from 'react-native-toast-message';
import {useIsDrawerOpen} from '@react-navigation/drawer';
import CardContainer from '../components/CardContainer';
import {Picker} from '@react-native-picker/picker';
import Context from '../Context';
import {TouchableWithoutFeedback} from 'react-native-gesture-handler';
import EventSource from 'react-native-sse';

const Matches = ({navigation}) => {
  const [matches, setMatches] = useState([]);
  const {
    user: {username, token},
    setUser,
  } = useContext(Context);

  useEffect(() => {
    loadMatches();
  }, [username, token]);

  const loadMatches = async () => {
    fetch('http://fauques.freeboxos.fr:3000/matches', {
      method: 'GET',
      headers: {
        'Content-type': 'application/json',
        Authorization: 'Bearer ' + token,
      },
    })
      .then(res => {
        return res.json();
      })
      .then(res => {
        console.log('all matches');
        console.log(res);
        setMatches(res);
      })
      .catch(err => console.log(err));
  };

  const newMatch = async () => {
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
          console.log('in id');
          navigation.navigate('Game', {gameId: id});
        } else {
          Toast.show({
            text1: "You're already in a match",
            position: 'bottom',
          });
        }
      })
      .catch(err => {
        console.log('new match error');
        console.log(err);
      });
  };

  const openGame = id => {
    navigation.navigate('Game', {gameId: id});
  };

  return (
    <View>
      <ScrollView style={styles.mainContainer}>
        {/* <Text>{token}</Text> */}
        <View style={styles.userView}>
          <Text>Current user: </Text>
          <Text>{username}</Text>
        </View>
        <View style={styles.buttonContainer}>
          <Button onPress={newMatch} title="new match" />
        </View>

        <Text style={styles.title}>All matches</Text>
        {matches.map(match => (
          <Match
            id={match._id}
            turns={match.turns}
            user1={match.user1}
            user2={match.user2}
            resume={match.winner || match.winner === null ? false : true}
            openGame={openGame}
          />
        ))}
      </ScrollView>
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

  title: {
    fontSize: 20,
    color: 'white',
  },
});

export default Matches;
