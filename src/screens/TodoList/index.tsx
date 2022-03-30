import React, {Children, useMemo, useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {useSharedValue} from 'react-native-reanimated';
import uuid from 'react-native-uuid';
import MovableTodoItem from './components/MovableTodoItem';
import {TodoItem} from './components/TodoItem';

function TodoList() {
  const [todoList, setTodoList] = useState<TodoItem[]>([]);
  const [inputValue, setInputValue] = useState<string>('');

  const idIndexObject = useMemo(() => {
    const values = Object.values(todoList);
    const object: {[key: string]: number} = {};

    for (let i = 0; i < values.length; i++) {
      object[values[i].id] = i;
    }

    return object;
  }, [todoList]);

  const positions = useSharedValue(idIndexObject);

  const addToList = () => {
    const id = String(uuid.v4());
    const newIndex = todoList.length;

    setTodoList(state => [...state, {title: inputValue, id, done: false}]);

    positions.value = {
      ...positions.value,
      [id]: newIndex,
    };

    setInputValue('');
  };

  const markAsDone = (id: string) => {
    setTodoList(state =>
      state.map(item => {
        if (item.id === id) {
          return {
            ...item,
            done: !item.done,
          };
        }

        return item;
      }),
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TextInput
          style={styles.input}
          value={inputValue}
          onChangeText={setInputValue}
          placeholder="Adicione um item"
          placeholderTextColor="#ddd"
        />

        <TouchableOpacity style={styles.button} onPress={addToList}>
          <Text style={styles.buttonText}>Add</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.container}>
        {Children.toArray(
          todoList.map(item => (
            <MovableTodoItem
              data={item}
              positions={positions}
              totalLength={todoList.length}
              onMarkAsDone={() => markAsDone(item.id)}
            />
          )),
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    padding: 16,
  },
  input: {
    backgroundColor: '#fff',
    borderColor: '#ddd',
    flex: 1,
    fontSize: 16,
    padding: 8,
    borderRadius: 8,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#011a72',
    paddingVertical: 8,
    borderRadius: 8,
    paddingHorizontal: 16,
    marginLeft: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textTransform: 'uppercase',
  },
});

export default TodoList;
