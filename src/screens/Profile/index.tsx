import React, {useCallback, useEffect, useState} from 'react';
import {
  FlatList,
  Image,
  ListRenderItemInfo,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import api from '../../services/api';
import RepositoryItem, {Repository} from './components/RepositoryItem';

interface UserData {
  name: string;
  avatar_url: string;
}

const HEADER_HEIGHT = 250;

function Profile() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [repos, setRepos] = useState<Repository[]>([]);

  const renderItem = useCallback(
    ({item}: ListRenderItemInfo<Repository>) => <RepositoryItem data={item} />,
    [],
  );

  useEffect(() => {
    async function loadData() {
      const {data: userInfo} = await api.get('/users/vinicfrancisco');
      const {data: reposInfo} = await api.get('/users/vinicfrancisco/repos');

      setUserData(userInfo);
      setRepos(reposInfo);
    }

    loadData();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {userData && (
          <>
            <Image style={styles.avatar} source={{uri: userData.avatar_url}} />

            <Text style={styles.username}>{userData.name}</Text>
          </>
        )}
      </View>

      <FlatList
        data={repos}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0d1117',
  },
  list: {
    paddingBottom: 16,
  },
  header: {
    alignItems: 'center',
    backgroundColor: '#161c22',
    height: HEADER_HEIGHT,
  },
  username: {
    color: '#FFF',
    marginVertical: 16,
  },
  avatar: {
    height: 120,
    width: 120,
    borderRadius: 60,
    marginTop: 'auto',
  },
});

export default Profile;
