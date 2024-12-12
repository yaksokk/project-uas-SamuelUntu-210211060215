import Icon from 'react-native-vector-icons/FontAwesome5';
import {useNavigation} from '@react-navigation/native';
import FastImage from 'react-native-fast-image';
import {fontType, colors} from '../theme';
import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
} from 'react-native';

const ContainerItem = ({item}) => {
  const navigation = useNavigation();
  const [selected, setSelected] = useState()
  const  klik = () => {
    setSelected(!selected)
  }
  const colorSelect = !selected ? colors.grey(.7) : colors.red()
  return (
    <TouchableOpacity
      style={listItems.cardItem}
      onPress={() => navigation.navigate('BlogDetail', {blogId: item.id})}>
      <FastImage
        style={listItems.cardImage}
        source={{
          uri: item?.image,
          headers: {Authorization: 'someAuthToken'},
          priority: FastImage.priority.high,
        }}
        resizeMode={FastImage.resizeMode.cover}></FastImage>
      <View style={listItems.cardContent}>
        <View style={listItems.cardInfo}>
          <Text style={listItems.cardCategory}>{item.category?.name}</Text>
          <Text style={listItems.cardTitle}>{item?.title}</Text>
          <Text style={listItems.cardPrice}>{item?.price}</Text>
        </View>
        <TouchableOpacity style={listItems.cardIcon} onPress={klik}>
          <Icon name="heart" solid size={21} color={colorSelect} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};
const ListItems = ({data, numColumns}) => {
  const [bookmark, setBookmark] = useState([]);
  const toggleBookmark = itemId => {
    if (bookmark.includes(itemId)) {
      setBookmark(bookmark.filter(id => id !== itemId));
    } else {
      setBookmark([...bookmark, itemId]);
    }
  };
  const renderItem = ({item}) => {
    variant = bookmark.includes(item.id) ? 'Bold' : 'Linear';
    return (
      <ContainerItem
        item={item}
        variant={variant}
        onPress={() => toggleBookmark(item.id)}
      />
    );
  };
  return (
    <FlatList
      data={data}
      keyExtractor={item => item.id}
      renderItem={item => renderItem({...item})}
      numColumns={numColumns}
      ItemSeparatorComponent={() => <View style={{width: 15}} />}
      scrollEnabled={false}
      // horizontal
      // showsHorizontalScrollIndicator={false}
    />
  );
};
export default ListItems;

const listItems = StyleSheet.create({
  cardItem: {
    backgroundColor: colors.black(0.09),
    position: 'relative',
    alignItems: 'center',
    marginHorizontal: 14,
    marginVertical: 14,
    paddingBottom: 7,
    borderRadius: 7,
    width: 170,
  },
  cardImage: {
    marginVertical: 14,
    borderRadius: 15,
    height: 100,
    width: 100,
  },
  cardContent: {
    flexDirection: 'row',
    maxWidth: '100%',
  },
  cardInfo: {
    paddingLeft: 10,
    width: '75%',
  },
  cardCategory: {
    fontSize: 10,
    color: colors.blue(),
    fontFamily: fontType['pps-Regular'],
  },
  cardTitle: {
    fontFamily: fontType['pps-Regular'],
    color: colors.black(),
    flexWrap: 'wrap',
    fontSize: 14,
  },
  cardPrice: {
    color: colors.black(),
    fontFamily: fontType['pps-Regular'],
    fontSize: 10,
    marginTop: 7,
  },
  cardIcon: {
    alignItems: 'center',
    width: '23%',
  },
});
