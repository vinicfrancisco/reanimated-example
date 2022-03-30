import React, {useCallback, useState} from 'react';
import {
  FlatList,
  ListRenderItemInfo,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import uuid from 'react-native-uuid';
import TodoItemComponent, {TodoItem} from './components/TodoItem';

function TodoList() {
  const [todoList, setTodoList] = useState<TodoItem[]>([]);
  const [inputValue, setInputValue] = useState<string>('');

  const addToList = () => {
    setTodoList(state => [
      ...state,
      {title: inputValue, id: String(uuid.v4()), done: false},
    ]);
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

  const renderItem = useCallback(
    ({item}: ListRenderItemInfo<TodoItem>) => (
      <TodoItemComponent data={item} onMarkAsDone={() => markAsDone(item.id)} />
    ),
    [],
  );

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

      <FlatList
        data={todoList}
        keyExtractor={item => item.id}
        renderItem={renderItem}
      />
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
