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
    database()
      .ref('.info/connected')
      .on('value', connectedSnap => {
        this.setState({isConnected: connectedSnap.val()});
      });
    this.getAsyncStorage();
  }

  getAsyncStorage = async () => {
    try {
      const user = await AsyncStorage.getItem('userId');
      this.setState({
        userId: user,
      });
    } catch (error) {
      // Error retrieving data
      Alert.alert(error.message);
    }
  };

  renderRow = ({item}) => {
    return (
      <TouchableOpacity
        onPress={() => {
          this.props.navigation.navigate('Event', item);
        }}
        style={{padding: 10, borderBottomColor: '#ccc', borderBottomWidth: 1}}>
        <Text> {item.titre}</Text>
      </TouchableOpacity>
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
        <Text>State : {this.state.userId}</Text>
        <Button
          title="Go to Maps"
          onPress={() => {
            navigate('Maps');
          }}
        />
        <Button
          title="Créer une soirée"
          onPress={() => navigate('AddEvent', this.state.userId)}
        />
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
