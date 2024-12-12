import Icon from 'react-native-vector-icons/FontAwesome5'
import {useNavigation} from '@react-navigation/native'
import React, { useRef, useEffect} from 'react'
import {fontType, colors} from '../theme'
import {
  StyleSheet,
  View,
  TextInput,
  Animated,
  TouchableOpacity,
} from 'react-native'

const SearchBar = ({searchPhrase, setSearchPhrase}) => {

  const navigation = useNavigation();
  const animation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animation, {
      toValue: 1,
      duration: 500,
      useNativeDriver: false,
    }).start();
  }, []);
  return (
    <Animated.View
      style={[
        styles.container,
        {
          gap: animation.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 12],
          }),
        },
      ]}>
      <Animated.View
        style={{
          transform: [
            {
              scale: animation.interpolate({
                inputRange: [0, 0.8, 1],
                outputRange: [0, 1.2, 1],
              }),
            },
          ],
        }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="long-arrow-alt-left" size={24} color={colors.black()} />
        </TouchableOpacity>
      </Animated.View>
      <View style={styles.bar}>
        <Icon name="search" size={21} color={colors.black()} />
        <TextInput
          style={styles.textinput}
          placeholder="Search"
          placeholderTextColor={colors.grey(0.7)}
          value={searchPhrase}
          onChangeText={setSearchPhrase}
          borderWidth={0}
          underlineColorAndroid="transparent"
          autoCorrect={false}
          autoFocus={true}
        />
        {searchPhrase && (
          <TouchableOpacity onPress={() => setSearchPhrase('')}>
            <Icon
              name="plus"
              size={14}
              color={colors.black()}
              style={{transform: [{rotate: '45deg'}]}}
            />
          </TouchableOpacity>
        )}
      </View>
    </Animated.View>
  );
};

export default SearchBar;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  bar: {
    flexDirection: 'row',
    padding: 10,
    gap: 10,
    alignItems: 'center',
    backgroundColor: colors.grey(0.14),
    borderRadius: 10,
    flex: 1,
  },
  textinput: {
    fontSize: 14,
    fontFamily: fontType['pps-Medium'],
    color: colors.black(),
    lineHeight: 21,
    padding: 0,
    flex: 1,
  },
});
