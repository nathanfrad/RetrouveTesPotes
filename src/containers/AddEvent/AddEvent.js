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
import {addUserWithEvent, addEventToUser} from '../../services/userService';

export default class AddEvent extends React.Component {
  static navigationOptions = {
    title: 'Home',
    headerStyle: {
      backgroundColor: colors.primary,
      borderBottomWidth: 0,
    },

    headerTintColor: '#fff',
    headerTitleStyle: {
      fontWeight: 'bold',
    },
  };

  constructor(props) {
    super(props);
    const error = [];
    this.state = {
      participants: [''],
      participantsTemporary: [''],
      ownersArray: this.props.navigation.state.params,
      userId: '',
    };
  }

  setAsyncStorage = async => {
    try {
      AsyncStorage.setItem('owners', JSON.stringify(this.state.ownersArray));
    } catch (error) {
      // Error retrieving data
      Alert.alert(error.message);
    }
  };

  componentDidMount = () =>
    AsyncStorage.getItem('userId').then(value =>
      this.setState({userId: value}),
    );

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

  submit() {
    if (this.state.titre !== '' || this.state.participants.length > 1) {
      // ref events
      let eventsPush = database()
        .ref('events/')
        .push();
      eventsPush
        .set({
          titre: this.state.titre,
        })
        .then(() => {
          // on parcours les participant du formulaire
          this.state.participants.map((pseudoParticipant, index) => {
            let participantPush = eventsPush.child('participants/').push();
            participantPush.set({
              pseudo: pseudoParticipant,
            });

            if (index === 0) {
              if (this.state.userId === '' || this.state.userId === null) {
                // on créer un nouveau user dans la base
                addUserWithEvent(
                  eventsPush,
                  participantPush,
                  pseudoParticipant,
                );
              } else {
                const userId = this.state.userId;
                // on ajoute l'evenement au owner existant
                addEventToUser(
                  userId,
                  eventsPush,
                  participantPush,
                  pseudoParticipant,
                );
              }
              // on stocke les pseudos owner
              this.setState({
                ownersArray: [
                  ...this.state.ownersArray,
                  {
                    eventsKey: eventsPush.key,
                    pseudo: pseudoParticipant,
                    id: participantPush.key,
                  },
                ],
              });
              this.setAsyncStorage();
            }
          });
        });
      this.props.navigation.navigate('Home');
    } else {
      Alert.alert('veuillez renseigner un titre');
    }
  }

  addParticipant(value) {
    this.setState({isOwner: this.state.participants.length !== 0});
    if (value === '') {
      Alert.alert('Veuillez remplir les champs participants');
    } else if (this.state.participants.includes(value)) {
      Alert.alert('Ce nom est déja present dans la liste');
    } else {
      this.setState({participants: [...this.state.participantsTemporary]});
      this.setState({
        participantsTemporary: [...this.state.participantsTemporary, ''],
      });
    }
  }

  removeParticipant(index) {
    this.setState({isOwner: this.state.participantsTemporary.length > 1});
    this.state.participantsTemporary.splice(index, 1);
    Alert.alert(this.state.participantsTemporary);
  }

  handleChange(value, index) {
    this.state.participantsTemporary[index] = value.trim();
    this.setState({participantsTemporary: this.state.participantsTemporary});
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
            {this.state.participantsTemporary.map((name, index) => {
              return (
                <View key={index} style={{flexDirection: 'row'}}>
                  <View style={{width: '80%'}}>
                    <TextInput
                      style={[styles.textinput, this.state.style]}
                      onChangeText={value => this.handleChange(value, index)}
                      value={name}
                      autoCompleteType={'name'}
                      placeholder={
                        this.state.isOwner ? 'Autre participant' : 'Votre nom'
                      }
                    />
                  </View>

                  {this.state.participantsTemporary.length - 1 === index ? (
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
