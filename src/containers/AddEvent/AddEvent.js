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
  TouchableOpacity,
  FlatList,
} from 'react-native';
import database from '@react-native-firebase/database';
import AsyncStorage from '@react-native-community/async-storage';
import {createUserWithEvent, addEventToUser} from '../../services/userService';
import {addDescriptionToEvent, createEvent} from '../../services/eventService';
import {fontSize, radius} from '../../styles/base';
import DateTimePickerComp from '../../components/DateTimePickerComp';
import ModalShare from '../../components/ModalShare';
import moment from 'moment';

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
      participantsTemporary: [''],
      ownersArray: this.props.navigation.state.params,
      userId: '',
      date: moment().format('DD-MM-YYYY'), //Current Date,
      modalVisible: false,
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

  validateForms = () => {
    this.switchModalVisible();
    // const {titre, participants} = this.state;
    // if (
    //   titre !== undefined &&
    //   titre.length > 0 &&
    //   !titre.replace(/\s/g, '').length &&
    //   participants.length >= 2
    // ) {
    //   this.submit();
    // } else {
    //   Alert.alert(
    //     'L\'évenement doit etre composé au minimum d\'un titre et de deux participants',
    //   );
    // }
  };

  submit = () => {
    // ref events
    let eventsPush = createEvent(this.state);

    eventsPush.then(() => {
      // on ajoute la description si elle existe
      if (this.state.description !== '') {
        addDescriptionToEvent(eventsPush, this.state.description);
      }
      // on parcours les participant du formulaire
      this.state.participants.map((pseudoParticipant, index) => {
        let participantPush = eventsPush.child('participants/').push();
        participantPush.set({
          pseudo: pseudoParticipant,
        });

        if (index === 0) {
          if (this.state.userId === '' || this.state.userId === null) {
            // on créer un nouveau user dans la base
            createUserWithEvent(eventsPush, participantPush, pseudoParticipant);
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
  };

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

  onFocus(index) {
    this.setState({
      [index]: colors.deepLemon,
    });
  }

  onBlur(index, value) {
    if (value === true) {
      this.setState({
        [index]: colors.grey,
      });
    } else if (
      value === undefined ||
      value.length === 0 ||
      !value.replace(/\s/g, '').length
    ) {
      this.setState({
        [index]: colors.red,
      });
    } else {
      this.setState({
        [index]: colors.grey,
      });
    }
  }

  onBlurParticipant(index, value) {
    if ((value === undefined || value.length === 0) && index < 2) {
      this.setState({
        [index]: colors.red,
      });
    } else {
      this.setState({
        [index]: colors.grey,
      });
    }
  }

  getTextStyle = value => {
    if (value !== undefined) {
      return {
        borderColor: value,
      };
    } else {
      return {
        borderColor: colors.grey,
      };
    }
  };

  itemPart = (name, index) => {
    return (
      <View style={styles.containerInputParticipant} key={index}>
        <View style={styles.containInputPart}>
          <TextInput
            ref={index}
            style={[
              styles.inputParticipant,
              this.getTextStyle(this.state[index]),
            ]}
            onChangeText={value => this.handleChange(value.toString(), index)}
            value={name}
            autoCompleteType={'name'}
            placeholderTextColor={colors.grey}
            max
            placeholder={this.state.isOwner ? 'Autre participant' : 'Votre nom'}
            maxLength={20}
            onFocus={() => this.onFocus(index)}
            onBlur={() => this.onBlurParticipant(index, name)}
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

  myCallback = dataFromChild => {
    this.setState({
      date: dataFromChild,
    });
  };

  switchModalVisible = () => {
    this.setState({modalVisible: !this.state.modalVisible});
  };

  closeModal = () => {
    this.switchModalVisible();
    this.props.navigation.navigate('Home');
  };

  render() {
    const {navigate} = this.props.navigation;
    return (
      <View style={styles.globalContainer}>
        {/*<Text>State : {this.state.userId}</Text>*/}

        <View style={styles.blockSombre}>
          <View style={styles.containerLabelInput}>
            <Text style={styles.titreClair} numberOfLines={1}>
              L'excuse de la soirée ?{' '}
            </Text>
            <TextInput
              style={[
                styles.textInput,
                this.getTextStyle(this.state.underlineTitre),
              ]}
              placeholder={'Titre'}
              onChangeText={value => this.setState({titre: value})}
              value={this.state.titre}
              // value={value}
              onSubmitEditing={() => {
                this.refs.inputDescription.focus();
              }}
              placeholderTextColor={colors.grey}
              maxLength={30}
              onFocus={() => this.onFocus('underlineTitre')}
              onBlur={() => this.onBlur('underlineTitre', this.state.titre)}
            />
          </View>
          <View style={styles.containerLabelInput}>
            <Text style={styles.titreClair} numberOfLines={1}>
              Description
            </Text>
            <TextInput
              style={[
                styles.textInput,
                this.getTextStyle(this.state.underlineDescript),
              ]}
              placeholder={'Pas d\'abus, que de l\'excés !'}
              onChangeText={text => this.setState({description: text})}
              value={this.state.description}
              onSubmitEditing={event => {
                this.refs.Description.focus();
              }}
              placeholderTextColor={colors.grey}
              onFocus={() => this.onFocus('underlineDescript')}
              onBlur={() => this.onBlur('underlineDescript', true)}
              maxLength={150}
              multiline={true}
            />
          </View>

          <DateTimePickerComp callbackFromParent={this.myCallback}/>
        </View>

        <View style={styles.containsFlatList}>
          <FlatList
            style={styles.scrollView}
            data={this.state.participantsTemporary}
            renderItem={({item, index}) => this.itemPart(item, index)}
            contentInset={{bottom: 100}}
            keyExtractor={(item, index) => '' + index}
            onScroll={e => {
              this.scrollOffset = e.nativeEvent.contentOffset.y;
            }}
            onLayout={e => {
              this.flatListHeight = e.nativeEvent.layout.height;
            }}
            scrollEventThrottle={16}
          />
        </View>

        <TouchableOpacity
          style={styles.btnValider}
          onPress={() => this.validateForms()}>
          <Text style={styles.titreSombre}>ça va etre la débandade</Text>
        </TouchableOpacity>
        <ModalShare
          modalVisibleBoolean={this.state.modalVisible}
          switchModalVisiblee={this.closeModal}
        />
      </View>
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
    marginTop: padding.lg,
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
    backgroundColor: colors.primary,
    color: colors.platinum,
  },
  underline: {
    borderColor: colors.grey,
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
    paddingHorizontal: padding.lg,
    paddingVertical: padding.sm,
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
