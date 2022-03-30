import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

export interface Repository {
  id: string;
  name: string;
  description: string;
}

interface RepositoryItemProps {
  data: Repository;
}

function RepositoryItem({data: {name, description}}: RepositoryItemProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{name}</Text>
      <Text style={styles.description}>{description || 'Sem descrição'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#21262e',
    borderRadius: 8,
    margin: 16,
    padding: 16,
  },
  title: {
    color: '#fff',
    marginBottom: 16,
    fontSize: 20,
  },
  description: {
    color: '#fff',
    fontSize: 14,
  },
});

export default RepositoryItem;
