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
import {padding, colors, fontSize, radius} from '../styles/base';
import AsyncStorage from '@react-native-community/async-storage';

import SuperHero from '../assets/svg/undraw_superhero_kguv.svg';

export default class HomeSave extends React.Component {
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
    this.state = {
      ownersArray: [],
      events: [],
    };
  }

  componentDidMount() {
    this.getAsyncStorage();

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
  }

  getAsyncStorage = async () => {
    try {
      const value = await AsyncStorage.getItem('owners');
      if (value !== null) {
        this.setState({
          ownersArray: JSON.parse(value),
        });
      }
    } catch (error) {
      // Error retrieving data
      Alert.alert(error.message);
    }
  };

  render() {
    const {navigate} = this.props.navigation;
    return (
      <View style={styles.body}>
        <View>
          <Text style={styles.welcome}>Retrouve Tes Potes</Text>
        </View>

        {this.state.events.map(event => {
          return (
            <View>
              <Text style={styles.titreClair}>{event.date}</Text>
            </View>
          );
        })}

        <TouchableOpacity
          style={styles.bulleLemon}
          onPress={() => {
            navigate('ViewMaps');
          }}>
          <Text style={styles.titreSombre}>Soirée en cours</Text>
          <Text style={styles.paragrapheSombre}>Anniversaire de Paul </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.bulleGrey}
          onPress={() => navigate('AddEvent', this.state.ownersArray)}>
          <Text style={styles.paragrapheClair}>
            Une nouvelle excuse pour faire soirée ?
          </Text>
          <Text style={styles.titreClair}>Créer une soirée</Text>
        </TouchableOpacity>
        <View style={styles.bulleGrey}>
          <Text style={styles.titreClair}>Rejoindre une soirée </Text>
        </View>

        <View style={styles.bulleSecours}>
          <SuperHero width={130} height={130}/>
          <View style={styles.textSecours}>
            <Text style={styles.titreSecours}>
              Deviens le heros de la soirée !
            </Text>
            <Text style={styles.sousTitreSecours}>
              Regarde les gestes de premiers secours, c'est pas sorcier !
            </Text>
          </View>
        </View>

        <View style={styles.bulleContour}>
          <Text style={styles.titreClair}>Statistique des soirée</Text>
          <Text style={styles.paragrapheClair}>Level 7 : Pilier de bar </Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  body: {
    flexDirection: 'column',
    padding: padding.lg,
    backgroundColor: colors.primary,
    width: '100%',
    height: '100%',
    justifyContent: 'space-evenly',
  },
  welcome: {
    color: colors.platinum,
    fontSize: fontSize.welcome,
    marginVertical: padding.sm,
    fontWeight: 'bold',
    // fontFamily: 'AmericanTypewriter-Light'
    fontFamily: 'MarkerFelt-Thin',
  },
  bulleBlue: {
    flexDirection: 'column',
    padding: padding.md,
    backgroundColor: colors.royalBlue,
    color: colors.platinum,
    borderRadius: radius.sm,
    marginVertical: padding.sm,
  },
  bulleLemon: {
    flexDirection: 'column',
    padding: padding.md,
    backgroundColor: colors.deepLemon,
    color: colors.primary,
    borderRadius: radius.sm,
    marginVertical: padding.sm,
  },
  bulleGrey: {
    flexDirection: 'column',
    padding: padding.md,
    backgroundColor: colors.secondary,
    color: colors.platinum,
    borderRadius: radius.sm,
    marginVertical: padding.sm,
  },

  bulleContour: {
    flexDirection: 'column',
    padding: padding.md,
    color: colors.platinum,
    borderRadius: radius.sm,
    marginVertical: padding.sm,
    borderColor: colors.deepLemon,
    borderWidth: 1,
  },

  bulleSecours: {
    flexDirection: 'row',
    color: colors.royalBlue,
    borderRadius: radius.sm,
    marginVertical: padding.sm,
    justifyContent: 'space-between',
    width: '100%',
  },
  containerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  titreSombre: {
    color: colors.primary,
    fontSize: fontSize.titre,
  },
  titreClair: {
    color: colors.platinum,
    fontSize: fontSize.titre,
  },
  paragrapheSombre: {
    color: colors.secondary,
    fontSize: fontSize.label,
  },

  paragrapheClair: {
    color: colors.grey,
    fontSize: fontSize.sousTitre,
    flex: 1,
  },
  textSecours: {
    flexDirection: 'column',
    justifyContent: 'center',
    flex: 1,
    paddingLeft: padding.sm,
  },
  titreSecours: {
    color: colors.platinum,
    fontSize: fontSize.titre,
    fontWeight: 'bold',
    paddingBottom: padding.sm,
  },
  sousTitreSecours: {
    color: colors.platinum,
    fontSize: fontSize.sousTitre,
  },
});
