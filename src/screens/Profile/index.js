import {StyleSheet, Text, View, TouchableOpacity} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import Icon from 'react-native-vector-icons/FontAwesome5'
import React, {useEffect, useState, useRef} from 'react'
import firestore from '@react-native-firebase/firestore'
import {useNavigation} from '@react-navigation/native';
import {formatNumber} from '../../utils/formatNumber'
import ActionSheet from 'react-native-actions-sheet'
import FastImage from 'react-native-fast-image'
import auth from '@react-native-firebase/auth'
import {fontType, colors} from '../../theme'

const Profile = () => {
  const navigation = useNavigation();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [blogData, setBlogData] = useState([]);
  const actionSheetRef = useRef(null);
  const openActionSheet = () => {
    actionSheetRef.current?.show();
  };
  const closeActionSheet = () => {
    actionSheetRef.current?.hide();
  };
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

    const fetchProfileData = () => {
      try {
        const user = auth().currentUser;
        if (user) {
          const userId = user.uid;
          const userRef = firestore().collection('users').doc(userId);

          const unsubscribeProfile = userRef.onSnapshot(doc => {
            if (doc.exists) {
              const userData = doc.data();
              setProfileData(userData);
              fetchBlogData();
            } else {
              console.error('Dokumen pengguna tidak ditemukan.');
            }
          });

          return () => {
            unsubscribeProfile();
          };
        }
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    };
    fetchBlogData();
    fetchProfileData();
  }, []);
  const handleLogout = async () => {
    try {
      closeActionSheet();
      await auth().signOut();
      await AsyncStorage.removeItem('userData');
      navigation.replace('Login');
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.header}></View>
      <View
        style={{
          height: '100%',
          gap: 10,
          alignItems: 'center',
          paddingHorizontal: 21,
          top: 70,
        }}>
        <FastImage
          style={profile.pic}
          source={{
            uri: profileData?.photoUrl,
            headers: {Authorization: 'someAuthToken'},
            priority: FastImage.priority.high,
          }}
          resizeMode={FastImage.resizeMode.cover}
        />
        <View style={{gap: 5, alignItems: 'center'}}>
          <Text style={profile.name}>{profileData?.fullName}</Text>
        </View>
        <View style={{flexDirection: 'row', gap: 20}}>
          <View style={{alignItems: 'center', gap: 5}}>
            <Text style={profile.sum}>{profileData?.totalPost}</Text>
            <Text style={profile.tag}>Product</Text>
          </View>
          <View style={{alignItems: 'center', gap: 5}}>
            <Text style={profile.sum}>
              {formatNumber(profileData?.followingCount)}
            </Text>
            <Text style={profile.tag}>Following</Text>
          </View>
          <View style={{alignItems: 'center', gap: 5}}>
            <Text style={profile.sum}>
              {formatNumber(profileData?.followersCount)}
            </Text>
            <Text style={profile.tag}>Follower</Text>
          </View>
        </View>
        <View style={styles.wrapper}>
          <TouchableOpacity style={styles.button}>
            <Icon name="thumbs-up" solid size={17} color={colors.black()} />
            <Text style={styles.title}>Rating</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Icon name="info-circle" size={17} color={colors.black()} />
            <Text style={styles.title}>About</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Icon name="cog" size={17} color={colors.black()} />
            <Text style={styles.title}>Settings</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button}>
            <Icon
              name="question-circle"
              solid
              size={17}
              color={colors.black()}
            />
            <Text style={styles.title}>Help & FAQ</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={openActionSheet}>
            <Icon name="sign-out-alt" size={17} color={colors.black()} />
            <Text style={styles.title}>Log Out</Text>
          </TouchableOpacity>
        </View>
      </View>
      <ActionSheet
        ref={actionSheetRef}
        containerStyle={{
          borderTopLeftRadius: 25,
          borderTopRightRadius: 25,
        }}
        indicatorStyle={{
          width: 100,
        }}
        gestureEnabled={true}
        defaultOverlayOpacity={0.3}>
        <TouchableOpacity
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            paddingVertical: 15,
          }}
          onPress={handleLogout}>
          <Text
            style={{
              fontFamily: fontType['pps-Medium'],
              color: colors.black(),
              fontSize: 18,
            }}>
            Log out
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            paddingVertical: 15,
          }}
          onPress={closeActionSheet}>
          <Text
            style={{
              fontFamily: fontType['pps-Medium'],
              color: 'red',
              fontSize: 18,
            }}>
            Cancel
          </Text>
        </TouchableOpacity>
      </ActionSheet>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: colors.blue(0.9),
    position: 'absolute',
    height: 125,
    top: 0,
    left: 0,
    right: 0,
  },
  borders: {
    borderColor: colors.black(0.7),
    alignItems: 'flex-start',
    position: 'relative',
    paddingHorizontal: 7,
    paddingVertical: 7,
    borderRadius: 7,
    borderWidth: 1,
    width: '100%',
    gap: 7,
  },
  button: {
    alignItems: 'center',
    flexDirection: 'row',
    width: '100%',
    gap: 7,
  },
  title: {
    fontFamily: fontType['pps-Medium'],
    color: colors.black(0.7),
    fontSize: 17,
  },
  wrapper: {
    backgroundColor: colors.black(0.07),
    paddingHorizontal: 14,
    alignItems: 'center',
    paddingVertical: 14,
    borderRadius: 14,
    marginTop: 28,
    width: '100%',
    gap: 14,
  },
});

const profile = StyleSheet.create({
  pic: {
    borderColor: colors.black(0.4),
    borderRadius: 100,
    borderWidth: 2,
    height: 100,
    width: 100,
  },
  name: {
    fontFamily: fontType['pps-Medium'],
    textTransform: 'capitalize',
    color: colors.black(),
    fontSize: 20,
  },
  sum: {
    fontFamily: fontType['pps-Medium'],
    color: colors.black(),
    fontSize: 16,
  },
  tag: {
    fontFamily: fontType['pps-Regular'],
    color: colors.grey(0.7),
    fontSize: 14,
  },
});
