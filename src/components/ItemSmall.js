import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {useNavigation} from '@react-navigation/native';
import {formatDate} from '../utils/formatDate';
import FastImage from 'react-native-fast-image';
import {fontType, colors} from '../theme';
import React, {useState} from 'react';

const ItemSmall = ({item}) => {
  const navigation = useNavigation();
  const [selected, setSelected] = useState()
  const  klik = () => {
    setSelected(!selected)
  }
  const colorSelect = !selected ? colors.grey(.7) : colors.red()
  return (
    <TouchableOpacity
      style={styles.cardItem}
      onPress={() => navigation.navigate('BlogDetail', {blogId: item.id})}>
      <FastImage
        style={styles.cardImage}
        source={{
          uri: item.image,
          headers: {Authorization: 'someAuthToken'},
          priority: FastImage.priority.high,
        }}
        resizeMode={FastImage.resizeMode.cover}
      />
      <View style={styles.cardContent}>
        <View
          style={{
            flexDirection: 'row',
            gap: 30,
          }}>
          <View style={{gap: 5, flex: 1}}>
            <Text style={styles.cardCategory}>{item.category?.name}</Text>
            <Text style={styles.cardTitle}>{item?.title}</Text>
            <Text style={styles.cardPrice}>Rp. {item?.price}</Text>
          </View>
          <TouchableOpacity onPress={klik}>
            <Icon name="heart" solid size={20} color={colorSelect} />
          </TouchableOpacity>
        </View>
        <View style={styles.cardInfo}>
          <Icon name="clock" size={10} color={colors.grey(0.7)} />
          <Text style={styles.cardText}>{formatDate(item?.createdAt)}</Text>
          <Icon name="comment-dots" size={10} color={colors.grey(0.7)} />
          <Text style={styles.cardText}>{item?.totalComments}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ItemSmall;
const styles = StyleSheet.create({
  listCard: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    gap: 15,
  },
  cardItem: {
    backgroundColor: colors.blue(0.07),
    flexDirection: 'row',
    borderRadius: 10,
    alignItems: 'center',
    paddingHorizontal: 14,
  },
  cardCategory: {
    color: colors.blue(),
    fontSize: 10,
    fontFamily: fontType['pps-Medium'],
  },
  cardTitle: {
    fontSize: 14,
    fontFamily: fontType['pps-Bold'],
    color: colors.black(),
  },
  cardText: {
    fontSize: 10,
    fontFamily: fontType['pps-Medium'],
    color: colors.grey(0.6),
  },
  cardImage: {
    width: 94,
    height: 94,
    borderRadius: 10,
    resizeMode: 'cover',
  },
  cardInfo: {
    flexDirection: 'row',
    gap: 5,
    alignItems: 'center',
  },
  cardContent: {
    gap: 10,
    justifyContent: 'space-between',
    paddingRight: 10,
    paddingLeft: 15,
    flex: 1,
    paddingVertical: 10,
  },
  cardPrice: {
    color: colors.grey(0.7),
    fontFamily: fontType['pps-Regular'],
    fontSize: 12,
  },
});
