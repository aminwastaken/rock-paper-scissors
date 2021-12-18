import React from 'react';
import {StyleSheet, View} from 'react-native';
import {TouchableOpacity} from 'react-native';
import Card from './Card';

const CardContainer = ({options, selected, selectOption}) => {
  return (
    <View style={styles.CardContainer}>
      {options?.map(option => (
        <TouchableOpacity onPress={() => selectOption(option)}>
          <Card icon={option} selected={option === selected} />
        </TouchableOpacity>
      ))}

      {/* <Card icon="paper" selected={true} />
      <Card icon="scissors" /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  CardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    margin: 20,
  },
});

export default CardContainer;
