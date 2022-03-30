import React, {useCallback, useEffect, useState} from 'react';
import {
  ListRenderItemInfo,
  NativeScrollEvent,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import api from '../../services/api';
import RepositoryItem, {Repository} from './components/RepositoryItem';

interface UserData {
  name: string;
  avatar_url: string;
}

const HEADER_HEIGHT = 250;
const COLLAPSED_HEADER_HEIGHT = 80;

function Profile() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [repos, setRepos] = useState<Repository[]>([]);

  const scrollY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler((event: NativeScrollEvent) => {
    scrollY.value = event.contentOffset.y;
  });

  const headerStyle = useAnimatedStyle(() => ({
    height: interpolate(
      scrollY.value,
      [0, 170],
      [HEADER_HEIGHT, COLLAPSED_HEADER_HEIGHT],
      Extrapolate.CLAMP,
    ),
  }));

  const avatarStyle = useAnimatedStyle(() => ({
    opacity: interpolate(scrollY.value, [0, 170], [1, 0], Extrapolate.CLAMP),
  }));

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
      <Animated.FlatList
        data={repos}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={scrollHandler}
      />

      <Animated.View style={[styles.header, headerStyle]}>
        {userData && (
          <>
            <Animated.Image
              style={[styles.avatar, avatarStyle]}
              source={{uri: userData.avatar_url}}
            />

            <Text style={styles.username}>{userData.name}</Text>
          </>
        )}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0d1117',
  },
  list: {
    paddingBottom: 16,
    // NEW
    paddingTop: HEADER_HEIGHT,
  },
  header: {
    alignItems: 'center',
    backgroundColor: '#161c22',
    height: HEADER_HEIGHT,
    // NEW
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
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
