import {createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import Home from './Screens/Home/Home';
import Login from './Screens/Login/Login';
import CreateAccount from './Screens/CreateAccount/CreateAccount';

const MainNavigator = createStackNavigator({
  Login: {screen: Login},
  Home: {screen: Home},
  CreateAccount: {screen: CreateAccount},
});

const App = createAppContainer(MainNavigator);

export default App;


