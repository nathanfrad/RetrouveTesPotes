import {StyleSheet, Dimensions} from 'react-native';

export const FONT_NORMAL = 'OpenSans-Regular';
export const FONT_BOLD = 'OpenSans-Bold';
export const BORDER_RADIUS = 5;

export const dimensions = {
  fullHeight: Dimensions.get('window').height,
  fullWidth: Dimensions.get('window').width,
};

export const radius = {
  sm: 5,
  md: 10,
  lg: 15,
  xl: 25,

};


export const colors = {
  primary: '#1b1a20',
  secondary: '#343338',
  royalBlue: '#6981EC',
  deepLemon: '#FCC117',
  platinum: '#EDEDF1',
  grey: '#78767b',
  red: '#ff1661',
  primaryTransparent: 'rgba(27, 26, 2, 0.5)',
};

export const padding = {
  sm: 10,
  md: 15,
  lg: 20,
  xl: 30,
  xxl: 50,
  xxxl: 80,
};
export const fontSize = {
  welcome: 28,
  titre: 23,
  sousTitre: 18,
  label: 15,
  paragraphe: 12,
};
export const fonts = {
  sm: 12,
  md: 18,
  lg: 28,
  primary: 'Cochin',
};
