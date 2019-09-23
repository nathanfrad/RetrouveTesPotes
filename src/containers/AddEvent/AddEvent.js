import React, {Fragment} from 'react';
import {colors, fonts, padding, dimensions} from '../../styles/base.js';

import {
  Text,
  View,
  TextInput,
  ScrollView,
  StyleSheet,
  Button,
  Alert,
} from 'react-native';
import database from '@react-native-firebase/database';
import AsyncStorage from '@react-native-community/async-storage';
import functions from '@react-native-firebase/functions';

export default class AddEvent extends React.Component {
  constructor(props) {
    super(props);
    const error = [];
    this.state = {
      participants: [''],
      ownersArray: this.props.navigation.state.params,
    };
  }

  onFocus() {
    this.inputTitre.setNativeProps({
      borderBottomColor: 'blue',
    });
  }

  onBlur() {
    this.inputTitre.setNativeProps({
      borderBottomColor: 'black',
    });
  }

  // validate(value) {
  //   const {titre, description} = this.state;
  //   this.setState({titre: value});
  //   if (value === '') {
  //     this.inputTitre.setNativeProps({
  //       borderBottomColor: 'red',
  //     });
  //   } else {
  //     Alert.alert('envoie des données a la base');
  //
  //   }
  // }
  setAsyncStorage = async => {
    try {
      AsyncStorage.setItem('owners', JSON.stringify(this.state.ownersArray));
    } catch (error) {
      // Error retrieving data
      Alert.alert(error.message);
    }
  };

  // componentDidMount(): void {
  //
  //   exports.makeUppercase = functions.database.ref('/messages/{pushId}/original')
  //     .onCreate((snapshot, context) => {
  //       // Grab the current value of what was written to the Realtime Database.
  //       const original = snapshot.val();
  //       console.log('Uppercasing', context.params.pushId, original);
  //       const uppercase = original.toUpperCase();
  //       // You must return a Promise when performing asynchronous tasks inside a Functions such as
  //       // writing to the Firebase Realtime Database.
  //       // Setting an "uppercase" sibling in the Realtime Database returns a Promise.
  //       return snapshot.ref.parent.child('uppercase').set(uppercase);
  //     });
  // }

  submit() {
    if (this.state.titre !== '' || this.state.participants.length > 1) {
      // ref events
      let eventsPush = database()
        .ref('events/')
        .push();
      let eventsKey = eventsPush.key;
      eventsPush
        .set({
          titre: this.state.titre,
        })
        .then(() => {
          // on parcours les participant du formulaire
          this.state.participants.map((participant, index) => {
            let participantPush = eventsPush
              .child('participants/')
              .push();
            let participantKey = participantPush.key;
            participantPush.set({
              pseudo: participant,
            });

            // let dbRefUserPush;
            // let keyUser = 0;
            if (index === 0) {
              if (this.state.ownersArray.length === 0) {
                // on créer un nouveau user dans la base
                let usersKey = database()
                  .ref('users')
                  .push();

                //   let updates = {
                //     [`event_enrolments/${keyEvents}/${keyParticipant}`]: {
                //       name: participant,
                //     },
                //     [`participant_enrolments/${keyParticipant}/${keyEvents}`]: {
                //       titre: this.state.titre,
                //     },
                //   };
                //   database()
                //     .ref()
                //     .update(updates);
                // });
                let updates = {
                  [`events/${eventsKey}/${participantKey}`]: {
                    pseudo: participant,
                  },
                };
                usersKey.update(updates);
              }
            }
          });
        });
      this.props.navigation.navigate('Home');
    } else {
      Alert.alert('veuillez renseigner un titre');
    }
  }

  addParticipant(value) {
    if (this.state.participants.length !== 0) {
      this.setState({user: true});
    }
    if (value !== '' && this.state.participants.includes(value)) {
      this.setState({participants: [...this.state.participants, '']});
    } else {
      Alert.alert('Ce nom est déja present dans la liste');
    }
  }

  removeParticipant(index) {
    this.state.participants.splice(index, 1);
    this.setState({participants: this.state.participants});
  }

  handleChange(value, index) {
    this.state.participants[index] = value.trim();
    this.setState({participants: this.state.participants});
  }

  render() {
    const {navigate} = this.props.navigation;
    return (
      <View style={styles.container}>
        <Text>State : {this.state.userId}</Text>
        <ScrollView>
          <View style={styles.containerLabelInput}>
            <Text numberOfLines={1}>Titre</Text>
            <TextInput
              ref={r => (this.inputTitre = r)}
              style={styles.textinput}
              onChangeText={value => this.setState({titre: value})}
              value={this.state.titre}
              // value={value}
              onSubmitEditing={() => {
                this.refs.inputDescription.focus();
              }}
              onBlur={() => this.onBlur()}
              onFocus={() => this.onFocus()}
            />
          </View>
          <View style={styles.containerLabelInput}>
            <Text numberOfLines={1}>Description</Text>
            <TextInput
              ref={'inputDescription'}
              style={[styles.textinput, this.state.inputDescription]}
              onChangeText={text => this.setState({description: text})}
              value={this.state.description}
              onSubmitEditing={event => {
                this.refs.Description.focus();
              }}
            />
          </View>
          <View style={styles.containerLabelInput}>
            <Text numberOfLines={1}>Participants</Text>
            {this.state.participants.map((name, index) => {
              return (
                <View key={index} style={{flexDirection: 'row'}}>
                  <View style={{width: '80%'}}>
                    <TextInput
                      style={[styles.textinput, this.state.style]}
                      onChangeText={value => this.handleChange(value, index)}
                      value={name}
                      autoCompleteType={'name'}
                      placeholder={
                        this.state.user ? 'Autre participant' : 'Votre nom'
                      }
                    />
                  </View>

                  {this.state.participants.length - 1 === index ? (
                    <Button
                      title="Add"
                      color="green"
                      onPress={() => this.addParticipant(name)}
                    />
                  ) : (
                    <Button
                      title="Suprr"
                      color="red"
                      onPress={() => this.removeParticipant(index)}
                    />
                  )}
                </View>
              );
            })}
          </View>
          <Button
            title="Créer l'evenement"
            color="#f194ff"
            onPress={() => this.submit()}
          />
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    display: 'flex',
    // alignItems: 'center',
    padding: padding.md,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
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
