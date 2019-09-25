/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Fragment} from 'react';

import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
} from 'react-native';

import Maps from '../components/Maps';
import {colors} from '../styles/base';
import database from '@react-native-firebase/database';

export default class ViewMaps extends React.Component {
  static navigationOptions = {
    headerStyle: {
      backgroundColor: colors.primary,
      borderBottomWidth: 0,
    },
    headerTintColor: colors.deepLemon,
    headerTitleStyle: {
      fontWeight: 'bold',
    },
  };

  render() {
    const {navigate} = this.props.navigation;
    return <Maps />;
  }
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    height: '100%',
    width: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});
