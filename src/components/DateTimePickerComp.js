import React, {Component} from 'react';
import {
  Button,
  View,
  Alert,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
} from 'react-native';
import DateTimePicker from 'react-native-modal-datetime-picker';
import moment from 'moment';
import {colors, fontSize, padding, radius} from '../styles/base';

export default class DateTimePickerComp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isDateTimePickerVisible: false,
    };
  }

  showDateTimePicker = () => {
    this.setState({isDateTimePickerVisible: true});
  };

  hideDateTimePicker = () => {
    this.setState({isDateTimePickerVisible: false});
  };

  handleDatePicked = date => {
    Alert.alert('A date has been picked: ', date.toString());
    this.props.callbackFromParent(date);
    // this.hideDateTimePicker();
  };

  render() {
    return (
      <>
        <View style={styles.containDatePicker}>
          <Text style={styles.citation} numberOfLines={1}>
            On arose tout ça le
          </Text>
          <TouchableOpacity
            style={styles.bulleContour}
            onPress={this.showDateTimePicker}>
            <Text style={styles.datePicker} numberOfLines={1}>
              {moment(Date(this.state.date)).format('DD-MM-YYYY')}
            </Text>
          </TouchableOpacity>
          <Text style={styles.citation} numberOfLines={1}>
            §
          </Text>
        </View>
        <DateTimePicker
          isVisible={this.state.isDateTimePickerVisible}
          onConfirm={this.handleDatePicked}
          onCancel={this.hideDateTimePicker}
        />
      </>
    );
  }
}

const styles = StyleSheet.create({
  containDatePicker: {
    flexDirection: 'row',
    color: colors.platinum,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bulleContour: {
    flexDirection: 'column',
    padding: padding.md,
    color: colors.platinum,
    borderRadius: radius.sm,
    margin: padding.sm,
    borderColor: colors.deepLemon,
    borderWidth: 1,
  },
  citation: {
    color: colors.deepLemon,
    fontSize: fontSize.titre,
  },
  datePicker: {
    color: colors.platinum,
    fontSize: fontSize.label,
  },
});
