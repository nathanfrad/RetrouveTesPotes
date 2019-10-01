import database from '@react-native-firebase/database';


export const createEvent = item => {
  database.ref('/items').push({
    name: item,
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
