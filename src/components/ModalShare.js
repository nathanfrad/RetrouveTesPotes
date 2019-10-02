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
          <View style={styles.modal}>
            <View>
              <Text style={styles.titreSombre}>
                Partage l'évenement aux participants
              </Text>
              <TouchableOpacity
                onPress={() => {
                  this.onShare();
                }}>
                <Text>Share</Text>
              </TouchableOpacity>
            </View>
            <View>
              <TouchableOpacity
                onPress={() => {
                  this.props.switchModalVisiblee();
                }}>
                <Text>Hide Modal</Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </Modal>
    );
  }
}

const styles = StyleSheet.create({
  containModal: {
    flexDirection: 'column',
    backgroundColor: colors.primaryTransparent,
    color: colors.platinum,
    width: '100%',
    height: '100%',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    overflow: 'hidden',
    flex: 1,
  },
  modal: {
    flexDirection: 'column',
    backgroundColor: colors.deepLemon,
    color: colors.platinum,
    alignItems: 'center',
    padding: padding.lg,
    borderRadius: radius.sm,
    marginVertical: padding.sm,
    maxWidth: '70%',
  },
  titreSombre: {
    color: colors.primary,
    fontSize: fontSize.titre,
  },
});
