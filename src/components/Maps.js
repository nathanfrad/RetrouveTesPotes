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

import MapView, {
  Marker,
  PROVIDER_GOOGLE,
  AnimatedRegion,
  Animated,
} from 'react-native-maps';

const {width, height} = Dimensions.get('window');

const ASPECT_RATIO = width / height;
const LATITUDE = 37.766041;
const LONGITUDE = -122.440703;
const LATITUDE_DELTA = 0.002;
const LONGITUDE_DELTA = 0.002;
const USER = 'Nathan';
const RadiusCircle = 50; // 50 metres

export const APPLE = {
  latitude: 37.766081,
  longitude: -122.440743,
  latitudeDelta: 0.002,
  longitudeDelta: 0.002,
};

class Maps extends React.Component {
  constructor(props) {
    super(props);
    this._currentRegion = new MapView.AnimatedRegion({
      latitude: LATITUDE,
      longitude: LONGITUDE,
      latitudeDelta: 0.002,
      longitudeDelta: 0.002,
    });

    this.state = {
      region: {
        latitude: LATITUDE,
        longitude: LONGITUDE,
        latitudeDelta: 0.002,
        longitudeDelta: 0.002,
      },
      markers: [
        {
          title: 'Arthur',
          coordinate: {
            latitude: 37.76607333,
            longitude: -122.44054,
            latitudeDelta: 0,
            longitudeDelta: 0,
          },
        },
        {
          title: 'Paul',
          coordinate: {
            latitude: 37.76609333,
            longitude: -122.442304,
            latitudeDelta: 0,
            longitudeDelta: 0,
          },
        },
        {
          title: 'Jean',
          coordinate: {
            latitude: 37.76606333,
            longitude: -122.44005,
            latitudeDelta: 0,
            longitudeDelta: 0,
          },
        },
      ],
    };
  }

  //
  // componentWillReceiveProps(nextProps) {
  //   const duration = 500;
  //
  //   if (this.props.coordinate !== nextProps.coordinate) {
  //     if (Platform.OS === 'android') {
  //       if (this.marker) {
  //         this.marker._component.animateMarkerToCoordinate(
  //           nextProps.coordinate,
  //           duration,
  //         );
  //       }
  //     } else {
  //       this.state.coordinate
  //         .timing({
  //           ...nextProps.coordinate,
  //           duration,
  //         })
  //         .start();
  //     }
  //   }
  // }

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

    if (lat1 == lat2 && lon1 == lon2) {
      return 0;
    } else {
      let radlat1 = (Math.PI * lat1) / 180;
      let radlat2 = (Math.PI * lat2) / 180;
      let theta = lon1 - lon2;
      let radtheta = (Math.PI * theta) / 180;
      let dist =
        Math.sin(radlat1) * Math.sin(radlat2) +
        Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);

      if (dist > 1) {
        dist = 1;
      }
      dist = Math.acos(dist);
      dist = (dist * 180) / Math.PI;
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
    this.setState(
      {
        averageMarker: {
          title: 'Average',
          coordinate: {
            latitude: averageLatitude,
            longitude: averageLongitude,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
          },
        },
      },
      () => {
        // this.verifDistance();
      },
    );
  };

  onRegionChange = region => {
    this.setState({region: region});
  };
  getCurrentLocalisation = () => {
    return new Promise(function (resolve, reject) {
      Geolocation.watchPosition(
        //succes
        positionUser => {
          resolve(positionUser.coords);
        },
        // error
        error => reject(error),
        // options
        {
          enableHighAccuracy: true,
          timeout: 20000,
          maximumAge: 1000,
          distanceFilter: 10,
        },
        {distanceFilter: 10},
      );
    });
  };

  componentDidMount() {
    this.getCurrentLocalisation().then(result => {
      const {latitude, longitude} = result;
      this.setState({
        markers: [
          ...this.state.markers,
          {
            title: USER,
            coordinate: {
              latitude: latitude,
              longitude: longitude,
              latitudeDelta: 0,
              longitudeDelta: 0,
            },
          },
        ],
      });

      this.setState({
        region: {
          latitude: latitude,
          longitude: longitude,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        },
      });

      this.setState({
        currentLocalisation: {
          latitude: latitude,
          longitude: longitude,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        },
      });
      this.centerCircle();
    });
  }

  changeTargetRegion = (target): void => {
    if (target === 'userLocalisation') {
      this._currentRegion
        .timing({...this.state.currentLocalisation, duration: 2000})
        .start();
    } else if (target === 'centerCercle') {
      this._currentRegion
        .timing({...this.state.averageMarker.coordinate, duration: 2000})
        .start();
    }
  };
  // changeTargetRegion = target => {
  //   if (target === 'centerCercle') {
  //     this.setState({
  //       region: new AnimatedRegion({
  //         latitude: this.state.averageMarker.coordinate.latitude,
  //         longitude: this.state.averageMarker.coordinate.longitude,
  //         latitudeDelta: LATITUDE_DELTA,
  //         longitudeDelta: LONGITUDE_DELTA,
  //       }),
  //     });
  //   } else if (target === 'userLocalisation') {
  //     this.setState({
  //       region: new AnimatedRegion({
  //         latitude: this.state.currentLocalisation.latitude,
  //         longitude: this.state.currentLocalisation.longitude,
  //         latitudeDelta: LATITUDE_DELTA,
  //         longitudeDelta: LONGITUDE_DELTA,
  //       }),
  //     });
  //   }
  // };

  _onRegionChangeComplete = (region: Region): void => {
    this._currentRegion.setValue(region);
  };


  test = () => {
    this.setState({
      averageMarker: {
        coordinate: {
          latitude: 37.76609313,
          longitude: -122.442404,
        },
      },
    });
  };

  render() {
    return (
      <View style={styles.container}>
        <MapView.Animated
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          region={this._currentRegion}
          onRegionChangeComplete={this._onRegionChangeComplete}
          // zoomEnabled={true}
          // scrollEnabled={true}
        >
          {this.state.markers.map((marker, index) => {
            if (marker.title === USER) {
              return (
                <MapView.Marker.Animated
                  description={marker.title}
                  title={marker.title}
                  pinColor={'green'}
                  key={index}
                  coordinate={marker.coordinate}
                />
              );
            } else {
              return (
                <MapView.Marker.Animated
                  description={marker.title}
                  title={marker.title}
                  pinColor={'blue'}
                  key={index}
                  coordinate={marker.coordinate}
                />
              );
            }
          })}

          {this.state.averageMarker && (
            <View>
              {/*<MapView.Circle*/}
              {/*  center={this.state.averageMarker.coordinate}*/}
              {/*  radius={RadiusCircle}*/}
              {/*  strokeColor={'rgba(1, 66, 96, 1)'}*/}
              {/*  strokeWidth={1}*/}
              {/*  fillColor={'rgba(1, 66, 96, 0.8)'}*/}
              {/*  ref={ref => {*/}
              {/*    this.circle = ref;*/}
              {/*  }}*/}
              {/*/>*/}
              <Marker
                title={this.state.averageMarker.title}
                key={'8'}
                pinColor={'red'}
                coordinate={this.state.averageMarker.coordinate}
              />
            </View>
          )}

          {/*<Marker coordinate={this.getMapRegion()}/>*/}
        </MapView.Animated>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={() => this.changeTargetRegion('userLocalisation')}
            style={styles.bubble}>
            <Text>Ma localisation</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => this.changeTargetRegion('centerCercle')}
            style={styles.bubble}>
            <Text>Centre du cercle</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

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
