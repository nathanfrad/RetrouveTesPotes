import database from '@react-native-firebase/database';
import AsyncStorage from '@react-native-community/async-storage';

export const createUserWithEvent = (
  eventsPush,
  participantPush,
  participant,
) => {
  // on créer un nouveau user dans la base
  let users = database()
    .ref('users')
    .push();
  let updates = {
    [`events/${eventsPush.key}/${participantPush.key}`]: {
      pseudo: participant,
    },
  };
  users.update(updates);
  AsyncStorage.setItem('userId', users.key);
};

export const addEventToUser = (
  userId,
  eventsPush,
  participantPush,
  pseudoParticipant,
) => {
  // on ajoute l'evenement au owner existant
  let updates = {
    [`users/${userId}/events/${eventsPush.key}/${participantPush.key}`]: {
      pseudo: pseudoParticipant,
    },
  };
  database()
    .ref()
    .update(updates);
};
