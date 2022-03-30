import React, {useState} from 'react';
import {StyleSheet} from 'react-native';
import {
  GestureEventPayload,
  PanGestureHandler,
  PanGestureHandlerEventPayload,
} from 'react-native-gesture-handler';
import Animated, {
  FadeInUp,
  FadeOutUp,
  runOnJS,
  SharedValue,
  useAnimatedGestureHandler,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import TodoItem, {TodoItemProps, TODO_ITEM_HEIGHT} from '../TodoItem';

interface MovableTodoItemProps extends TodoItemProps {
  positions: SharedValue<{[key: string]: number}>;
  totalLength: number;
}

const CONTAINER_VERTICAL_MARGIN = 4;
const CONTAINER_HEIGHT = TODO_ITEM_HEIGHT + 2 * CONTAINER_VERTICAL_MARGIN;

interface ClampProps {
  value: number;
  lowerBound: number;
  upperBound: number;
}

interface ObjectMove {
  positions: {[key: string]: number};
  from: number;
  to: number;
}

function clamp({value, lowerBound, upperBound}: ClampProps) {
  'worklet';
  return Math.max(lowerBound, Math.min(value, upperBound));
}

function objectMove({positions, from, to}: ObjectMove) {
  'worklet';
  const newObject = Object.assign({}, positions);

  for (const id in positions) {
    if (positions[id] === from) {
      newObject[id] = to;
    }

    if (positions[id] === to) {
      newObject[id] = from;
    }
  }

  return newObject;
}

function MovableTodoItem({
  positions,
  totalLength,
  data,
  ...rest
}: MovableTodoItemProps) {
  const [moving, setMoving] = useState(false);

  const top = useSharedValue(positions.value[data.id] * CONTAINER_HEIGHT);

  useAnimatedReaction(
    () => positions.value[data.id],
    (currentPosition, previousPosition) => {
      if (currentPosition !== previousPosition) {
        if (!moving) {
          top.value = withSpring(currentPosition * CONTAINER_HEIGHT);
        }
      }
    },
    [moving],
  );

  const containerAnimatedStyle = useAnimatedStyle(() => ({
    zIndex: moving ? 1 : 0,
    shadowOpacity: withSpring(moving ? 0.2 : 0),
    top: top.value,
  }));

  const gestureHandler = useAnimatedGestureHandler({
    onStart: () => {
      runOnJS(setMoving)(true);
    },
    onActive: (
      event: Readonly<GestureEventPayload & PanGestureHandlerEventPayload>,
    ) => {
      const positionY = event.absoluteY - 150;

      top.value = withTiming(positionY - CONTAINER_HEIGHT, {
        duration: 16,
      });

      const newPosition = clamp({
        value: Math.floor(positionY / CONTAINER_HEIGHT),
        lowerBound: 0,
        upperBound: totalLength - 1,
      });

      if (newPosition !== positions.value[data.id]) {
        positions.value = objectMove({
          positions: positions.value,
          from: positions.value[data.id],
          to: newPosition,
        });
      }
    },
    onFinish: () => {
      top.value = positions.value[data.id] * CONTAINER_HEIGHT;

      runOnJS(setMoving)(false);
    },
  });

  return (
    <Animated.View
      entering={FadeInUp}
      exiting={FadeOutUp}
      style={[styles.container, containerAnimatedStyle]}>
      <PanGestureHandler onGestureEvent={gestureHandler}>
        <Animated.View>
          <TodoItem data={data} {...rest} />
        </Animated.View>
      </PanGestureHandler>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    marginHorizontal: 16,
    marginVertical: CONTAINER_VERTICAL_MARGIN,
    shadowColor: 'black',
    shadowOffset: {
      height: 0,
      width: 0,
    },
    shadowRadius: 10,
    left: 0,
    right: 0,
    position: 'absolute',
  },
});

export default MovableTodoItem;
