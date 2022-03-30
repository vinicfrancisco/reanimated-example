import React, {useRef} from 'react';
import {
  Animated,
  Button,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import Reanimated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

function Animations() {
  const {width} = useWindowDimensions();

  const animatedValue = useRef(new Animated.ValueXY({x: 0, y: 0}));
  const reanimatedValue = useSharedValue(0);

  const reanimatedStyle = useAnimatedStyle(
    () => ({
      transform: [{translateX: reanimatedValue.value}],
    }),
    [],
  );

  const startAnimatedAction = () => {
    Animated.timing(animatedValue.current.x, {
      toValue: Math.random() * width,
      duration: 250,
      useNativeDriver: false,
    }).start();
  };

  const startReanimatedAction = () => {
    reanimatedValue.value = withTiming(Math.random() * width, {
      duration: 250,
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.subtitle}>React Native Animated</Text>
      <Animated.View
        style={[
          styles.square,
          {
            transform: [{translateX: animatedValue.current.x}],
          },
        ]}
      />
      <Button title="START" onPress={startAnimatedAction} />

      <Text style={styles.subtitle}>Reanimated</Text>
      <Reanimated.View style={[styles.square, reanimatedStyle]} />
      <Button title="START" onPress={startReanimatedAction} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  square: {
    backgroundColor: 'red',
    height: 64,
    width: 64,
  },
  subtitle: {
    alignSelf: 'center',
    fontSize: 18,
    marginVertical: 32,
  },
});

export default Animations;
