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
import {deleteEvent} from '../services/eventService';

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
    };
  }

  componentDidMount() {
    this.getAsyncStorage();
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
      <View style={styles.globalContainer}>
        <View>
          <Text style={styles.welcome}>Retrouve Tes Potes</Text>
        </View>

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
          <Text style={styles.paragrapheClair}>Une nouvelle excuse pour faire soirée ?</Text>
          <Text style={styles.titreClair}>Créer une soirée</Text>
        </TouchableOpacity>
        <View style={styles.bulleGrey}>
          <Text style={styles.titreClair}>Rejoindre une soirée </Text>
        </View>

        <View style={styles.bulleSecours}>
          <Text style={styles.titreClair}>
            Deviens le herosd e la soirée ! Regarde les premiers gestes de
            secours
          </Text>
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
  globalContainer: {
    flexDirection: 'column',
    padding: padding.md,
    backgroundColor: colors.primary,
    color: colors.platinum,
    minWidth: '100%',
    minHeight: '100%',
    justifyContent: 'space-evenly',
    fontSize: 40,
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
    flexDirection: 'column',
    padding: padding.lg,
    color: colors.royalBlue,
    borderRadius: radius.sm,
    marginVertical: padding.sm,
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
  },
});
