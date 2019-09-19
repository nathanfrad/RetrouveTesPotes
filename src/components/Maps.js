import React from 'react';

import Geolocation from '@react-native-community/geolocation';

import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  Alert,
} from 'react-native';

import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';

const {width, height} = Dimensions.get('window');

const ASPECT_RATIO = width / height;
const LATITUDE = 37.78825;
const LONGITUDE = -122.4324;
const LATITUDE_DELTA = 0.006922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const USER = 'Nathan';
const RadiusCircle = 100;


class Maps extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      region: {
        latitude: LATITUDE,
        longitude: LONGITUDE,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      },
      myGeolocation: {
        latitude: LATITUDE,
        longitude: LONGITUDE,
        error: null,
      },
      markers: [
        {
          title: 'Arthur',
          coordinate: {
            latitude: 37.76607333,
            longitude: -122.4405400,
          },
        },
        {
          title: 'Paul',
          coordinate: {
            latitude: 37.76609333,
            longitude: -122.4423040,
          },
        },
        {
          title: 'Jean',
          coordinate: {
            latitude: 37.76606333,
            longitude: -122.4400500,
          },
        },
      ],
    };
  }


  getMapRegion = () => ({
    latitude: this.state.latitude,
    longitude: this.state.longitude,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
  });


  getDistance = (point1, point2, unit) => {

    let lat1 = point1.coordinate.latitude;
    let lon1 = point1.coordinate.longitude * -1;
    let lat2 = point2.coordinate.latitude;
    let lon2 = point2.coordinate.longitude * -1;

    if ((lat1 == lat2) && (lon1 == lon2)) {
      return 0;
    } else {
      let radlat1 = Math.PI * lat1 / 180;
      let radlat2 = Math.PI * lat2 / 180;
      let theta = lon1 - lon2;
      let radtheta = Math.PI * theta / 180;
      let dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);

      if (dist > 1) {
        dist = 1;
      }
      dist = Math.acos(dist);
      dist = dist * 180 / Math.PI;
      dist = dist * 60 * 1.1515;
      if (unit == 'K') {
        dist = dist * 1.609344;
      }
      if (unit == 'N') {
        dist = dist * 0.8684;
      }
      return dist;
    }
  };

  verifDistance = () => {
    this.state.markers.map((marker, index) => {
      let dist = this.getDistance(marker, this.state.averageMarker, 'M');
      // Alert.alert(marker.title + ' DIST : ' + dist);
      if (dist > RadiusCircle) {
        Alert.alert(marker.title + ' est trop loin ! dist : ' + dist);
      }
    });
  };

  centerCircle = () => {
    let totalLatitude = 0;
    let totalLongitude = 0;
    let averageLatitude = 0;
    let averageLongitude = 0;
    this.state.markers.map((marker, index) => {
      totalLatitude = totalLatitude + marker.coordinate.latitude;
      totalLongitude = totalLongitude + marker.coordinate.longitude;
      averageLatitude = totalLatitude / (index + 1);
      averageLongitude = totalLongitude / (index + 1);
    });

    this.setState({
      averageMarker: {
        title: 'Average',
        coordinate: {
          latitude: averageLatitude,
          longitude: averageLongitude,
        },
      },
    });

    this.setState({
      averageMarker: {
        title: 'Average',
        coordinate: {
          latitude: averageLatitude,
          longitude: averageLongitude,
        },
      },
    }, () => {
      this.verifDistance();
    });

  };

  componentDidMount() {

    Geolocation.watchPosition(
      positionUser => {
        const {latitude, longitude} = positionUser.coords;
        this.setState({latitude, longitude});

        this.setState({
          markers: [
            ...this.state.markers,
            {
              title: USER,
              coordinate: {
                latitude: latitude,
                longitude: longitude,
              },
            },
          ],
        });

      },
      error => console.log(error),
      {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 1000,
        distanceFilter: 10,
      },
      {distanceFilter: 10},
    );
    this.centerCircle();

  }


  render() {
    return (
      <View style={styles.container}>
        <MapView
          provider={PROVIDER_GOOGLE}
          //provider={PROVIDER_GOOGLE}
          style={styles.map}
          region={this.getMapRegion()}
          // initialRegion={this.state.region}
        >

          {this.state.markers.map((marker, index) => {
            if (marker.title === USER) {
              return (<Marker
                description={marker.title}
                title={marker.title}
                pinColor={'green'}
                key={index}
                coordinate={marker.coordinate}
              />);
            } else {
              return (<Marker
                description={marker.title}
                title={marker.title}
                pinColor={'blue'}
                key={index}
                coordinate={marker.coordinate}
              />);
            }
          })}

          {this.state.averageMarker &&
          <View>
            <MapView.Circle
              center={this.state.averageMarker.coordinate}
              radius={RadiusCircle}
              strokeColor={'rgba(1, 66, 96, 1)'}
              strokeWidth={1}
              fillColor={'rgba(1, 66, 96, 0.2)'}
            />
            <Marker
              title={this.state.averageMarker.title}
              key={'8'}
              pinColor={'red'}
              coordinate={this.state.averageMarker.coordinate}/>
          </View>
          }

          {/*<Marker coordinate={this.getMapRegion()}/>*/}

        </MapView>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={() => this.setState({markers: []})}
            style={styles.bubble}
          >
            <Text>Tap to create a marker of random color</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

Maps.propTypes = {
  provider: PROVIDER_GOOGLE,
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  bubble: {
    backgroundColor: 'rgba(255,255,255,0.7)',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 20,
  },
  latlng: {
    width: 200,
    alignItems: 'stretch',
  },
  button: {
    width: 80,
    paddingHorizontal: 12,
    alignItems: 'center',
    marginHorizontal: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginVertical: 20,
    backgroundColor: 'transparent',
  },
});

export default Maps;
