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

  turns: {
    marginLeft: 20,
  },
  turn: {
    margin: 10,
  },
});

const Match = ({id, turns, user1, user2}) => {
  return (
    <View style={styles.container}>
      <View style={[styles.line]}>
        <Text>id: </Text>
        <Text>{id}</Text>
      </View>
      <View style={[styles.line, {flexDirection: 'column'}]}>
        <View>
          <Text>turns: </Text>
        </View>
        {/* <Text>{JSON.stringify(turns)}</Text> */}
        <View style={styles.turns}>
          {turns?.map((turn, index) => {
            const keys = Object.keys(turn);
            return (
              <View style={styles.turn}>
                {keys.map(key => (
                  <View style={[styles.line]}>
                    <Text>
                      {key === 'user1' ? user1.username : user2.username} :
                    </Text>
                    <Text>{turn[key]}</Text>
                  </View>
                ))}
              </View>
            );
          })}
        </View>
      </View>
      <View style={[styles.line]}>
        <Text>user1: </Text>
        <Text>{user1?.username}</Text>
      </View>
      <View style={[styles.line]}>
        <Text>user2: </Text>
        <Text>{user2?.username}</Text>
      </View>
    </View>
  );
};

export default Match;
