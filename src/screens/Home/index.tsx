import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {Button, StyleSheet, View} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

function Home() {
  const {navigate} = useNavigation();

  return (
    <View style={styles.container}>
      <Button title="Animaçòes" onPress={() => navigate('Animations')} />
      <Button title="Perfil" onPress={() => navigate('Profile')} />
      <Button title="TodoList" onPress={() => navigate('TodoList')} />
    </View>
  );
}

export default Home;
