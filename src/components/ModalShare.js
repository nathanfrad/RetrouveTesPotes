import React, {Component} from 'react';
import {
  Modal,
  Text,
  TouchableHighlight,
  View,
  Alert,
  SafeAreaView, StyleSheet,
} from 'react-native';
import moment from 'moment';
import {colors, fontSize, padding, radius} from '../styles/base';

export default class ModalShare extends Component {
  constructor(props) {
    super(props);
    // this.state = {
    //   modalVisible: false,
    // };
  }

  // component(): void {
  //   this.setState(
  //     {
  //       modalVisible: this.props.modalVisibleBoolean,
  //     },
  //     () => {
  //       Alert.alert('cc : ' + this.state.modalVisible);
  //     },
  //   );
  // }
  //
  // switchModalVisible() {
  //   this.setState({modalVisible: !this.state.modalVisible});
  // }

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
            </View>
            <View>
              <TouchableHighlight
                onPress={() => {
                  this.props.switchModalVisiblee();
                }}>
                <Text>Hide Modal</Text>
              </TouchableHighlight>
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
