import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#18181B',
    margin: 20,
    padding: 20,
    borderRadius: 10,
    justifyContent: 'center',
  },

  line: {
    flexDirection: 'row',
  },
});

const Match = ({id, turns, user1, user2}) => {
  return (
    <View style={styles.container}>
      <View style={[styles.line]}>
        <Text>id:</Text>
        <Text>{id}</Text>
      </View>
      <View style={[styles.line]}>
        <Text>turns:</Text>
        <View>
          {turns.map(turn => (
            <Text>{turn}</Text>
          ))}
        </View>
      </View>
      <View style={[styles.line]}>
        <Text>player 1: </Text>
        <Text>{user1?.username}</Text>
      </View>
      <View style={[styles.line]}>
        <Text>player 2: </Text>
        <Text>{user2?.username}</Text>
      </View>
    </View>
  );
};

export default Match;
