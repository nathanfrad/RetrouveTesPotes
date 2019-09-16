/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Fragment} from 'react';
import firebase from 'firebase';
import {
  Button,
  View,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Text,
  Alert,
} from 'react-native';

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      events: [],
    };
  }

  componentDidMount() {
    // Your web app's Firebase configuration
    var firebaseConfig = {
      apiKey: 'AIzaSyAFQkhCf2j7zR_zMgur9Ih5YI0O1CxVL2Q',
      authDomain: 'retrouvetespotes.firebaseapp.com',
      databaseURL: 'https://retrouvetespotes.firebaseio.com',
      projectId: 'retrouvetespotes',
      storageBucket: '',
      messagingSenderId: '162773113245',
      appId: '1:162773113245:web:fbb1d9297cff79ba2cf774',
    };
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    firebase.database().isPersistenceEnabled = true;
    let scoresRef = firebase.database().ref('scores');
    scoresRef.keepSynced(true);

    let dbRef = firebase.database().ref('events');
    dbRef.on('child_added', val => {
      let evenement = val.val();
      evenement.id = val.key;
      this.setState(prevState => {
        return {
          events: [...prevState.events, evenement],
        };
      });
    });

    let connectedRef = firebase.database().ref('.info/connected');
    connectedRef.on('value', function (snap) {
      if (snap.val() === true) {
        alert('connected');
      } else {
        alert('not connected');
      }
    });
  }

  renderRow = ({item}) => {
    return (
      <TouchableOpacity
        onPress={() => this.props.navigation.navigate('Event', item)}
        style={{padding: 10, borderBottomColor: '#ccc', borderBottomWidth: 1}}>
        <Text> {item.titre}</Text>
      </TouchableOpacity>
    );
  };

  render() {
    const {navigate} = this.props.navigation;
    return (
      <View>
        <Button title="Go to Maps" onPress={() => navigate('ViewMaps')}/>

        <Button title="Créer une soirée" onPress={() => navigate('AddEvent')}/>
        <SafeAreaView>
          <FlatList
            keyExtractor={item => item.id}
            data={this.state.events}
            renderItem={this.renderRow}
          />
        </SafeAreaView>
      </View>
    );
  }
}
