import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

export interface TodoItem {
  title: string;
  done: boolean;
  id: string;
}

export interface TodoItemProps {
  data: TodoItem;
  onMarkAsDone: () => void;
}

export const TODO_ITEM_HEIGHT = 40;

function TodoItem({data, onMarkAsDone}: TodoItemProps) {
  return (
    <View style={[styles.container, {opacity: data.done ? 0.5 : 1}]}>
      <Text style={styles.title}>{data.title}</Text>

      <TouchableOpacity style={styles.button} onPress={onMarkAsDone}>
        <Text style={styles.buttonText}>{data.done ? '✅' : '☑️'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    flexDirection: 'row',
    height: TODO_ITEM_HEIGHT,
    padding: 8,
  },
  title: {
    flex: 1,
    fontSize: 16,
  },
  button: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  buttonText: {},
});

export default TodoItem;
