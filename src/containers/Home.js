/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Fragment} from 'react';
import database from '@react-native-firebase/database';
import {
  Button,
  View,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Text,
  Alert,
  StyleSheet,
} from 'react-native';
import {padding} from '../styles/base';
import AsyncStorage from '@react-native-community/async-storage';

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      events: [],
      isConnected: '',
      owners: [],
    };
  }

  componentDidMount() {
    let dbRef = database().ref('events');
    dbRef.on('child_added', val => {
      let evenement = val.val();
      evenement.id = val.key;
      this.setState(prevState => {
        return {
          events: [...prevState.events, evenement],
        };
      });
    });

    // connecté ou déconnecté
    database()
      .ref('.info/connected')
      .on('value', connectedSnap => {
        this.setState({isConnected: connectedSnap.val()});
      });
    this.getAsyncStorage();
  }

  getAsyncStorage = async () => {
    try {
      const value = await AsyncStorage.getItem('owners');
      if (value !== null) {
        this.setState({
          owners: JSON.parse(value),
        });
      }
    } catch (error) {
      // Error retrieving data
      Alert.alert(error.message);
    }
  };
  remove = item => {
    let dbRef = database().ref('events');
    dbRef.on('value', function (snapshot) {
      let tabl = [];
      snapshot.forEach(function (child) {
        tabl.push(child);
      });
      Alert.alert(tabl);
    });

    // let updates = {
    //   [`event_enrolments/${item.id}`]: null,
    //   [`events/${item.id}`]: null,
    //   [`events/${item.id}`]: null,
    // };
    // database()
    //   .ref()
    //   .update(updates);
    //
  };

  renderEvents = ({item}) => {
    return (
      <View style={{flexDirection: 'row'}}>
        <TouchableOpacity
          onPress={() => {
            this.props.navigation.navigate('Event', item);
          }}
          style={{
            padding: 10,
            borderBottomColor: '#ccc',
            borderBottomWidth: 1,
          }}>
          <Text> {item.titre}</Text>
        </TouchableOpacity>
        <Button title="Suppr" onPress={() => this.remove(item)}/>
      </View>
    );
  };

  renderOwners = ({item}) => {
    return (
      <Text>
        {item.name} : {item.id}
      </Text>
    );
  };

  render() {
    const {navigate} = this.props.navigation;
    return (
      <View>
        {this.state.isConnected ? (
          <Text style={styles.connected}>Connécté</Text>
        ) : (
          <Text style={styles.offline}>Déconnéctée</Text>
        )}
        <SafeAreaView>
          <FlatList
            keyExtractor={item => item.id}
            data={this.state.owners}
            renderItem={this.renderOwners}
          />
        </SafeAreaView>
        <Button
          title="Go to Maps"
          onPress={() => {
            navigate('ViewMaps');
          }}
        />
        <Button
          title="Créer une soirée"
          onPress={() => navigate('AddEvent', this.state.owners)}
        />
        <SafeAreaView>
          <FlatList
            keyExtractor={item => item.id}
            data={this.state.events}
            renderItem={this.renderEvents}
          />
        </SafeAreaView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  connected: {
    alignItems: 'center',
    padding: padding.md,
    backgroundColor: 'green',
  },
  offline: {
    alignItems: 'center',
    padding: padding.md,
    backgroundColor: 'red',
  },
  bubble: {
    backgroundColor: 'rgba(255,255,255,0.7)',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 20,
  },
  latlng: {
    width: 200,
    alignItems: 'stretch',
  },
  button: {
    width: 80,
    paddingHorizontal: 12,
    alignItems: 'center',
    marginHorizontal: 10,
  },
  containerLabelInput: {
    marginVertical: 10,
  },
  textinput: {
    flexDirection: 'row',
    backgroundColor: 'transparent',
    paddingHorizontal: 6,
    height: 40,
    borderColor: 'gray',
    borderBottomColor: '#47315a',
    borderBottomWidth: 1,
  },
});
