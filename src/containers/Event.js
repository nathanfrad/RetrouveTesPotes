import React, {Fragment} from 'react';
import {colors, fonts, padding, dimensions} from '../styles/base.js';

import {
  Text,
  View,
  TextInput,
  ScrollView,
  StyleSheet,
  Button,
  Alert, SafeAreaView, FlatList,
} from 'react-native';
import firebase from 'firebase';


export default class Event extends React.Component {
  static navigationOptions = ({navigation}) => {
    return {
      title: navigation.getParam('titre', null),
    };
  };

  constructor(props) {
    super(props);

  }

  render() {
    const {navigate} = this.props.navigation;
    return (
      <View>
        <Text>
          One Event
        </Text>


      </View>
    );
  }


}
