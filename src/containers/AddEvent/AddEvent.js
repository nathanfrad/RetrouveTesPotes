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
import firebase from 'firebase';

export default class AddEvent extends React.Component {

  constructor(props) {
    super(props);
    const error = [];
    this.state = {
      titre: '',
      description: '',
      user: '',
      participants: [''],
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


  /* Récupération de la description */
  handleDescription = text => {
    this.setState({
      soiree: {
        description: text,
      },
    });
  };

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

  submit() {

    if (this.state.titre !== '' || this.state.participants.length !== 1) {

      // ref events
      let dbRefEvent = firebase.database().ref('events/');
      let dbRefEventPush = dbRefEvent.push();
      let keyEvents = dbRefEventPush.getKey();
      dbRefEvent.child(keyEvents).set({
        titre: this.state.titre,


      }).then(() => {

        // ref Participants
        let dbRefParticipants = firebase.database().ref('participants/');
        this.state.participants.map((participant) => {
          let dbRefParticipantsPush = dbRefEvent.push();
          let keyParticipants = dbRefParticipantsPush.getKey();
          dbRefParticipants.child(keyParticipants).set({
            name: participant,
          });
          // ref participant_enrolments
          // ref event_enrolments
          let updates = {
            [`event_enrolments/${keyEvents}/${keyParticipants}`]: {name: participant},
            [`participant_enrolments/${keyParticipants}/${keyEvents}`]: {titre: this.state.titre},
          };
          firebase.database().ref().update(updates);

        });
      });


      // let dbRefParticipant = firebase.database().ref('events/participant');
      //
      // let dbRefParticipantPush = dbRefEvent.push();

      this.props.navigation.navigate('Home');


    } else {

      // this.inputTitre.setNativeProps({
      //   borderBottomColor: 'red',
      // });
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
      Alert.alert('bip error');
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
        <ScrollView>

          <View style={styles.containerLabelInput}>
            <Text numberOfLines={1}>
              Titre
            </Text>
            <TextInput
              ref={r => this.inputTitre = r}
              style={styles.textinput}
              onChangeText={value => this.setState({titre: value})}
              value={this.state.titre}
              // value={value}
              onSubmitEditing={(event) => {
                this.refs.inputDescription.focus();
              }}

              onBlur={() => this.onBlur()}
              onFocus={() => this.onFocus()}
            />
          </View>

          <View style={styles.containerLabelInput}>
            <Text numberOfLines={1}>
              Description
            </Text>
            <TextInput
              ref={'inputDescription'}
              style={[styles.textinput, this.state.inputDescription]}
              onChangeText={(text) => this.setState({description: text})}
              value={this.state.description}
              onSubmitEditing={(event) => {
                this.refs.Description.focus();
              }}

            />
          </View>

          <View style={styles.containerLabelInput}>
            <Text numberOfLines={1}>
              Participants
            </Text>

            {
              this.state.participants.map((name, index) => {
                return (
                  <View style={{flexDirection: 'row'}}>
                    <View key={index}
                          style={{width: '80%'}}>
                      <TextInput
                        style={[styles.textinput, this.state.style]}
                        onChangeText={(value) => this.handleChange(value, index)} s
                        value={name}
                        autoCompleteType={'name'}
                        placeholder={this.state.user ? 'Autre participant' : 'Votre nom'}
                      />
                    </View>

                    {this.state.participants.length - 1 === index ? (
                      <Button
                        title="Add"
                        color="green"
                        onPress={() => this.addParticipant(name)}
                      />) : (
                      <Button
                        title="Suprr"
                        color="red"
                        onPress={() => this.removeParticipant(index)}
                      />
                    )}
                  </View>
                );

              })
            }


          </View>
          <Button
            title='Press me'
            color='#f194ff'
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


// import React, {useState, useEffect} from 'react';
// import {View, Text, Button} from 'react-native';
//
// export const Example = () => {
//   const [foo, setFoo] = useState(30);
//
//   useEffect(() => {
//     if (foo >= 42) {
//       setFoo(42);
//     }
//   }, [foo])
//
//   return (
//     <View>
//       <Text>Foo is {foo}.</Text>
//       <Button onPress={() => setFoo(foo + 1)} title='Increase Foo!' />
//     </View>
//   )
// }
