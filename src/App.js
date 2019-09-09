import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import Home from './containers/Home';
import ViewMaps from './containers/ViewMaps';
import AddEvent from './containers/AddEvent/AddEvent';
import Event from './containers/Event';

const MainNavigator = createStackNavigator({

  Home: {
    screen: Home, navigationOptions: ({navigation}) => ({
      title: 'RetrouveTesPotes',
    }),
  },
  ViewMaps: {
    screen: ViewMaps, navigationOptions: ({navigation}) => ({
      title: 'Maps',
    }),
  },
  AddEvent: {
    screen: AddEvent, navigationOptions: ({navigation}) => ({
      title: 'Créer une soirée',
    }),
  },
  Event: {
    screen: Event,
  },
}, {
  initialRouteName: 'Home',
});

const App = createAppContainer(MainNavigator);

export default App;

