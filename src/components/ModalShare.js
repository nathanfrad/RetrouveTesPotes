import React, {Component} from 'react';
import {
  Modal,
  Text,
  View,
  Alert,
  SafeAreaView,
  StyleSheet,
  Share,
  TouchableOpacity,
} from 'react-native';
import moment from 'moment';
import {colors, fontSize, padding, radius} from '../styles/base';
import HavingFun from '../assets/svg/undraw_having_fun_iais.svg';
import SocialMedia from '../assets/svg/shareSombre.svg';

export default class ModalShare extends Component {
  constructor(props) {
    super(props);
  }

  onShare = async () => {
    try {
      const result = await Share.share({
        message:
          'React Native | A framework for building native apps using React',
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  };

  render() {
    // Alert.alert('cc :' + this.state.modalVisible);
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={this.props.modalVisibleBoolean}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
        }}>
        <SafeAreaView style={styles.containModal}>
          <HavingFun width={'90%'} height={'40%'}/>

          <TouchableOpacity
            style={styles.modal}
            onPress={() => {
              this.onShare();
            }}>
            <View style={styles.textModal}>
              <Text style={styles.titreSombre} numberOfLines={1}>
                Préviens les participants !
              </Text>
              <Text style={styles.sousTitreSombre}>
                Dépêche-toi, avant qu'il n'y ai plus de bulles...
              </Text>
            </View>

            <View style={styles.share}>
              <SocialMedia width={40} height={40}/>
            </View>
          </TouchableOpacity>
          <View style={styles.skip}>
            <TouchableOpacity
              onPress={() => {
                this.props.switchModalVisiblee();
              }}>
              <Text style={{color: colors.platinum}}>Plus tard</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  containModal: {
    flexDirection: 'column',
    backgroundColor: colors.primary,
    color: colors.platinum,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    flex: 1,
  },
  modal: {
    flexDirection: 'row',
    backgroundColor: colors.deepLemon,
    color: colors.platinum,
    padding: padding.md,
    borderRadius: radius.sm,
    marginTop: -100,
    width: '80%',
    justifyContent: 'space-between',
  },
  titreSombre: {
    color: colors.primary,
    fontSize: fontSize.sousTitre,
    fontWeight: 'bold',
    paddingBottom: padding.sm,
  },
  sousTitreSombre: {
    color: colors.primary,
    fontSize: fontSize.label,
  },
  textModal: {
    width: '75%',
  },
  share: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: padding.sm,
  },
  skip: {
    width: '80%',
    justifyContent: 'flex-end',
    flexDirection: 'row',
    color: colors.platinum,
    padding: padding.sm,
  },
});
