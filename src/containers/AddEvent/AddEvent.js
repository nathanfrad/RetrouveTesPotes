import React, {Fragment} from 'react';
import {colors, fonts, padding, dimensions} from '../../styles/base.js';

import {
  Text,
  View,
  TextInput,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  Button,
  Alert,
  TouchableOpacity, FlatList,
} from 'react-native';
import database from '@react-native-firebase/database';
import AsyncStorage from '@react-native-community/async-storage';
import {addUserWithEvent, addEventToUser} from '../../services/userService';
import {fontSize, radius} from '../../styles/base';

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
      participants: [],
      participantsTemporary: ['art', 'gens', 'paul', 'erix'],
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

  componentDidMount = () => {
    AsyncStorage.getItem('userId').then(value =>
      this.setState({userId: value}),
    );
  };

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

  addParticipant(value, index) {
    if (value === '') {
      Alert.alert('Veuillez remplir les champs participants');
    } else if (this.state.participants.includes(value)) {
      Alert.alert('Ce nom est déja present dans la liste');
    } else {
      this.setState(
        {participants: this.state.participantsTemporary.filter(Boolean)},
        () => {
          this.setState({isOwner: this.state.participants.length > 0});
          this.scrollToIndex(index);
        },
      );
      this.setState({
        participantsTemporary: [...this.state.participantsTemporary, ''],
      });

    }
  }

  removeParticipant(index) {
    Alert.alert(index);
    this.state.participantsTemporary.splice(index, 1);
    this.setState(
      {participants: this.state.participantsTemporary.filter(Boolean)},
      () => {
        this.setState({isOwner: this.state.participants.length > 0});
      },
    );
  }

  handleChange(value, index) {
    this.state.participantsTemporary[index] = value.trim();
    this.setState({participantsTemporary: this.state.participantsTemporary});
  }

  onFocus(value) {
    this.setState({
      [value]: colors.deepLemon,
    });
  }

  onBlur() {
    this.ref.setNativeProps({
      borderBottomColor: colors.grey,
    });
  }

  itemPart = (name, index) => {
    return (
      <View style={styles.containerInputParticipant} key={index}>
        <View style={styles.containInputPart}>
          <TextInput
            style={[styles.inputParticipant, this.state.style]}
            onChangeText={value => this.handleChange(value.toString(), index)}
            value={name}
            autoCompleteType={'name'}
            placeholderTextColor={colors.grey}
            max
            placeholder={this.state.isOwner ? 'Autre participant' : 'Votre nom'}
            maxLength={20}
          />
        </View>
        {this.state.participantsTemporary.length - 1 === index ? (
          <TouchableOpacity
            style={styles.addparticipant}
            onPress={() => this.addParticipant(name, index)}>
            <Text style={styles.titreSombre}>+</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.removeparticipant}
            onPress={() => this.removeParticipant(index)}>
            <Text style={{color: colors.deepLemon}}>X</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  scrollToIndex = index => {
    // this.flatListRef.scrollToEnd();
    this.flatListRef.scrollToOffset({animated: true, offset: 200});
    // this.flatListRef.scrollToOffset({
    //   offset: this.scrollOff + 90,
    //   animated: false,
    // });
  };

  render() {
    const {navigate} = this.props.navigation;
    return (
      <SafeAreaView style={styles.globalContainer}>
        {/*<Text>State : {this.state.userId}</Text>*/}

        <View style={styles.blockSombre}>
          <View style={styles.containerLabelInput}>
            <Text style={styles.titreClair} numberOfLines={1}>
              L'excuse de la soirée ?{' '}
            </Text>
            <TextInput
              style={styles.textInput}
              placeholder={'Titre'}
              onChangeText={value => this.setState({titre: value})}
              value={this.state.titre}
              // value={value}
              onSubmitEditing={() => {
                this.refs.inputDescription.focus();
              }}
              placeholderTextColor={colors.grey}
              onBlur={() => this.onBlur()}
              onFocus={() => this.onFocus('titreUnderline')}
              maxLength={30}
            />
          </View>
          <View style={styles.containerLabelInput}>
            <Text style={styles.titreClair} numberOfLines={1}>
              Description
            </Text>
            <TextInput
              ref={'inputDescription'}
              style={[styles.textInput, this.state.inputDescription]}
              placeholder={'Pas d\'abus, que de l\'excés !'}
              onChangeText={text => this.setState({description: text})}
              value={this.state.description}
              onSubmitEditing={event => {
                this.refs.Description.focus();
              }}
              placeholderTextColor={colors.grey}
              onBlur={() => this.onBlur()}
              onFocus={() => this.onFocus(this.ref)}
              maxLength={150}
              multiline={true}
            />
          </View>
        </View>

        <View style={styles.containsFlatList}>
          <FlatList
            ref={ref => {
              this.flatListRef = ref;
            }}
            style={styles.scrollView}
            data={this.state.participantsTemporary}
            renderItem={({item, index}) => this.itemPart(item, index)}
            contentInset={{bottom: 100}}
            keyExtractor={(item, index) => '' + index}
            onScroll={e => {
              this.scrollOff = e.nativeEvent.contentOffset.y;
            }}
          />
        </View>

        <TouchableOpacity
          style={styles.btnValider}
          onPress={() => this.submit()}>
          <Text style={styles.titreSombre}>ça va etre la débandade</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  globalContainer: {
    flexDirection: 'column',
    backgroundColor: colors.secondary,
    color: colors.platinum,
    width: '100%',
    height: '100%',
    justifyContent: 'flex-start',
    overflow: 'hidden',
    flex: 1,
  },
  scrollView: {
    // borderWidth: 5,
    // borderColor: 'green',
    // backgroundColor: 'red',
    paddingHorizontal: padding.md,
  },
  containsFlatList: {
    flex: 1,
  },
  blockSombre: {
    color: colors.platinum,
    backgroundColor: colors.primary,
  },
  btnValider: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    color: colors.primary,
    backgroundColor: colors.deepLemon,
    padding: padding.md,
    borderTopLeftRadius: radius.sm,
    borderBottomLeftRadius: radius.sm,
    fontSize: fontSize.sousTitre,
    marginLeft: padding.xxxl,
    marginVertical: padding.xl,
  },
  titreClair: {
    color: colors.platinum,
    fontSize: fontSize.sousTitre,
  },
  containerInputParticipant: {
    flexDirection: 'row',
    backgroundColor: colors.deepLemon,
    color: colors.platinum,
    borderRadius: radius.xl,
    marginVertical: padding.sm,
  },
  containInputPart: {
    backgroundColor: colors.primary,
    paddingVertical: padding.sm,
    paddingHorizontal: padding.lg,
    paddingTop: 2,
    borderRadius: radius.xl,
    borderBottomRightRadius: 90,
    borderTopRightRadius: 0,
    flex: 9,
  },
  inputParticipant: {
    paddingVertical: padding.sm,
    borderBottomWidth: 1,
    borderColor: colors.grey,
    backgroundColor: colors.primary,
    color: colors.platinum,
  },
  addparticipant: {
    padding: padding.md,
    backgroundColor: colors.deepLemon,
    color: colors.platinum,
    borderRadius: radius.xl,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  removeparticipant: {
    padding: padding.md,
    backgroundColor: colors.primary,
    color: colors.platinum,
    borderColor: colors.deepLemon,
    borderWidth: 2,
    borderRadius: radius.xl,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    borderTopLeftRadius: 160,
    borderTopRightRadius: 90,
    borderBottomRightRadius: 90,
  },
  bubble: {
    backgroundColor: 'rgba(255,255,255,0.7)',
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
  containerLabelInput: {
    flexDirection: 'column',
    padding: padding.lg,
  },
  textInput: {
    borderBottomWidth: 1,
    borderColor: colors.grey,
    backgroundColor: colors.primary,
    color: colors.platinum,
    marginVertical: padding.sm,
    paddingVertical: padding.sm,
  },
});
