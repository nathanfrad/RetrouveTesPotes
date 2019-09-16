import React, {Fragment} from 'react';
import {colors, fonts, padding, dimensions} from '../styles/base.js';

import {
  Text,
  View,
  TextInput,
  ScrollView,
  StyleSheet,
  Button,
  Alert,
  SafeAreaView,
  FlatList,
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
    this.state = {
      event: this.props.navigation.state.params,
      participants: [],
    };
  }

  componentDidMount(): void {
    let database = firebase.database();

    // List Student enrolments for a class
    database
      .ref(`event_enrolments/${this.state.event.id}`)
      .once('value')
      .then(snapshot => {
        let returnArr = [];
        snapshot.forEach(function (childSnapshot) {
          let item = childSnapshot.val();
          item.key = childSnapshot.key;
          returnArr.push(item);
        });
        this.setState(prevState => ({
          participants: returnArr,
        }));
      });


  }

  render() {
    const {navigate} = this.props.navigation;
    return (
      <View>
        <Text>One Event</Text>
        {this.state.participants.map((item, key) => (
          <Text>{item.name}</Text>
        ))}
      </View>
    );
  }
}
