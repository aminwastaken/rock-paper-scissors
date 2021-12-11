import React, {useEffect, useState} from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';

const Card = ({icon, selected}) => {
  let [image, setImage] = useState(<Text>place holder</Text>);

  useEffect(() => {
    console.log('icon is : ' + icon);

    if (icon === 'rock')
      setImage(
        <Image
          source={require('../media/images/rock.png')}
          style={[styles.image]}
        />,
      );

    if (icon === 'paper')
      setImage(
        <Image
          source={require('../media/images/paper.png')}
          style={[styles.image]}
        />,
      );

    if (icon === 'scissors')
      setImage(
        <Image
          source={require('../media/images/scissors.png')}
          style={[styles.image]}
        />,
      );
  }, []);

  return (
    <View
      style={[
        styles.card,
        {backgroundColor: selected ? '#38BF87' : '#2F2F2F'},
      ]}>
      {image}
      {/* <Image
        source={require('../media/images/rock.png')}
        style={[styles.image]}
      /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 100,
    height: 100,
    backgroundColor: '#2F2F2F',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },

  image: {
    height: 50,
    width: 50,
  },
});

export default Card;
