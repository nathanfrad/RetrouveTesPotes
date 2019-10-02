import React, {Component} from 'react';
import {
  Modal,
  Text,
  TouchableHighlight,
  View,
  Alert,
  SafeAreaView,
} from 'react-native';
import moment from 'moment';

export default class ModalShare extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
    };
  }

  component(): void {
    this.setState(
      {
        modalVisible: this.props.modalVisibleBoolean,
      },
      () => {
        Alert.alert('cc : ' + this.state.modalVisible);
      },
    );
  }

  switchModalVisible() {
    this.setState({modalVisible: !this.state.modalVisible});
  }

  render() {
    // Alert.alert('cc :' + this.state.modalVisible);
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={this.state.modalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
        }}>
        <SafeAreaView>
          <View style={{backgroundColor: 'red'}}>
            <View>
              <Text>Hello World!</Text>

              <TouchableHighlight
                onPress={() => {
                  this.switchModalVisible();
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
