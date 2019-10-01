import database from '@react-native-firebase/database';

export const createEvent = (item) => {
  let eventsPush = database()
    .ref('events/')
    .push();
  eventsPush.set({
    titre: item.titre,
    date: item.date,
  });
  return eventsPush;
};

export const addDescriptionToEvent = (eventsPush, value) => {
  eventsPush.set({
    description: value,
  });
};

export const deleteEvent = event => {
  let updates = {};
  let dbRef = database().ref('users');
  dbRef.on('child_added', val => {
    updates[`users/${val.key}/events/${event.id}`] = null;
    updates[`events/${event.id}`] = null;
    database()
      .ref()
      .update(updates);
  });
};
