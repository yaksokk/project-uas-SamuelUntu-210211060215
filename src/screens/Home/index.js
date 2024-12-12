import Icon from 'react-native-vector-icons/FontAwesome5';
import React, {useState, useRef, useEffect} from 'react';
import firestore from '@react-native-firebase/firestore';
import {CategoryList} from '../../../data';
import {useNavigation} from '@react-navigation/native';
import auth from '@react-native-firebase/auth'
import {fontType, colors} from './../../theme';
import {ListItems, ListHorizontal} from './../../components';
import {
  Animated,
  FlatList,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ActivityIndicator,
} from 'react-native';

const Home = () => {
  const navigation = useNavigation();
  const scrollY = useRef(new Animated.Value(0)).current;
  const diffClampY = Animated.diffClamp(scrollY, 0, 200);
  const recentY = diffClampY.interpolate({
    inputRange: [0, 200],
    outputRange: [0, -200],
    extrapolate: 'clamp',
  });

  const [loading, setLoading] = useState(true);
  const [blogData, setBlogData] = useState([]);
  useEffect(() => {
    const user = auth().currentUser;
    const fetchBlogData = () => {
      try {
        if (user) {
          const userId = user.uid;
          const blogCollection = firestore().collection('blog');
          const query = blogCollection.where('authorId', '==', userId);
          const unsubscribeBlog = query.onSnapshot(querySnapshot => {
            const blogs = querySnapshot.docs.map(doc => ({
              ...doc.data(),
              id: doc.id,
            }));
            setBlogData(blogs);
            setLoading(false);
          });

          return () => {
            unsubscribeBlog();
          };
        }
      } catch (error) {
        console.error('Error fetching blog data:', error);
      }
    };

    fetchBlogData();
  }, []);

  const listData = blogData
  const horizontalData = blogData
  return (
    <View style={styles.container}>
      <View style={[styles.top]}>
        <TouchableWithoutFeedback
          onPress={() => navigation.navigate('SearchPage')}>
          <View style={styles.search}>
            <Icon name="search" size={24} color={colors.black()} />
            <Text style={styles.placeholder}>Search</Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
      <Animated.View
        style={[
          styles.animatedContainer,
          {transform: [{translateY: recentY}]},
        ]}>
        <Text style={styles.title}>Discover Your Badminton Look</Text>
        <View style={styles.listCategory}>
          <ListCategory />
        </View>
      </Animated.View>
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{nativeEvent: {contentOffset: {y: scrollY}}}],
          {useNativeDriver: true},
        )}
        contentContainerStyle={{paddingTop: 200}}>
        {loading ? (
          <ActivityIndicator size={'large'} color={colors.blue()} />
        ) : (
          <View style={styles.containerItem}>
            <ListHorizontal data={horizontalData}/>
            <View style={styles.listCard}>
            <ListItems data={listData} numColumns={2} />
            </View>
          </View>
        )}
      </Animated.ScrollView>
    </View>
  );
};

export default Home;

const ListCategory = () => {
  const [selected, setSelected] = useState(1);
  const renderItem = ({item}) => {
    const color = item.id === selected ? colors.blue() : colors.black(0.7);
    return (
      <ItemCategory
        item={item}
        onPress={() => setSelected(item.id)}
        color={color}
      />
    );
  };
  return (
    <FlatList
      data={CategoryList}
      keyExtractor={item => item.id}
      renderItem={item => renderItem({...item})}
      ItemSeparatorComponent={() => <View style={{width: 10}} />}
      contentContainerStyle={{paddingHorizontal: 24}}
      horizontal
      showsHorizontalScrollIndicator={false}
    />
  );
};
const ItemCategory = ({item, onPress, color}) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={category.item}>
        <Text style={{...category.title, color}}>{item.category}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white(),
  },
  top: {
    backgroundColor: colors.white(),
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    zIndex: 1000,
    height: 70,
    gap: 14,
    right: 0,
    left: 0,
    top: 0,
  },
  search: {
    backgroundColor: colors.grey(0.17),
    alignItems: 'center',
    flexDirection: 'row',
    borderRadius: 7,
    width: '90%',
    padding: 10,
    gap: 7,
  },
  placeholder: {
    marginLeft: 7,
    fontFamily: fontType['pps-Medium'],

    lineHeight: 21,
    color: colors.black(0.7),
  },
  listCategory: {
    alignItems: 'center',
    paddingVertical: 21,
    position: 'relative',
  },
  title: {
    fontFamily: fontType['pps-Medium'],
    fontSize: 42,
    color: colors.black(),
    textAlign: 'center',
  },
  animatedContainer: {
    position: 'absolute',
    backgroundColor: colors.white(),
    borderRadius: 14,
    elevation: 1000,
    zIndex: 999,
    right: 0,
    left: 0,
    top: 69,
  },
  containerItem: {
    backgroundColor: colors.white(),
    paddingBottom: 70,
    paddingTop: 14,
    paddingTop:70,
    justifyContent:'center'
  },
  listCard:{
    marginTop:20,
  },
});

const category = StyleSheet.create({
  item: {
    backgroundColor: colors.grey(0.08),
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 25,
  },
  title: {
    fontFamily: fontType['pps-Medium'],
    lineHeight: 18,
    fontSize: 14,
  },
});
