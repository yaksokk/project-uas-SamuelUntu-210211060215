import firestore from '@react-native-firebase/firestore';
import {colors, fontType} from './../../theme';
import {ListItems} from './../../components';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import React, {useState, useEffect} from 'react';

export default function Wishlist() {
  const [loading, setLoading] = useState(true);
  const [blogData, setBlogData] = useState([]);
  useEffect(() => {
    const fetchBlogData = () => {
      try {
        const blogCollection = firestore().collection('blog');
        const unsubscribeBlog = blogCollection.onSnapshot(querySnapshot => {
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
      } catch (error) {
        console.error('Error fetching blog data:', error);
      }
    };
    fetchBlogData();
  }, []);

  const listData = blogData;

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <Text style={styles.title}>Wishlist</Text>
      </View>
      <View style={styles.container}>
          {loading ? (
            <ActivityIndicator size={'large'} color={colors.blue()} />
          ) : (
            <ListItems data={listData} numColumns={2} />
          )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white(),
    minHeight:613,
    paddingVertical:14
  },
  header: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1.7,
    borderColor: colors.blue(0.7),
  },
  title: {
    fontSize: 28,
    color: colors.blue(),
    fontFamily: fontType['pps-Medium'],
  },
});
