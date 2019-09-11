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
    this.state = {
      event: this.props.navigation.state.params,
      participants: [],
    };


  }

  componentDidMount(): void {


    let database = firebase.database();

    // List Student enrolments for a class
    database.ref(`event_enrolments/${this.state.event.id}`).once('value')
      .then((snapshot) => {

        snapshot.forEach(function (childSnapshot) {
          let item = childSnapshot.val();
          item.key = childSnapshot.key;

          this.setState({participants: [...this.state.participants, item]});
        });


      }).then(Alert.alert(this.state.participants[0].name));

    // // Get Class Metadata using classId
    // database.ref(`events/${this.state.event.id}`).once('value')
    //   .then((snapshot) => {
    //     Alert.alert(snapshot.val());
    //   });

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
