import React from 'react';
import {View, StyleSheet, Image} from 'react-native';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';
import {Marker, Callout} from 'react-native-maps';
import {Text} from '@rneui/base';
import Geolocation from '@react-native-community/geolocation';
import axios from 'axios';
import {styles} from '../Helpers/AppStyles';
import * as constants from '../Helpers/Constants';
import {markerImages} from '../Helpers/MarkerImages';

export default class MapScreen extends React.Component {
  // Constructor
  constructor(props) {
    super(props);
    this.state = {
      latitude: constants.initialLat,
      longitude: constants.initialLong,
      markers: [],
      locationData: [],
      selectMarker: null,
      loading: true, // Initialize as loading
      bottomTooFarMessage: false, // Initialize as loading
    };
  }

  // component actions
  componentDidMount = () => {
    this.callApiToUpdateMap();
  };

  // Functions
  callApiToUpdateMap = () => {
    axios
      .get(constants.apiBaseUrl + constants.endpointLocations )
      .then(response => {
        const mapResponseData = response.data.data;
        if (Array.isArray(mapResponseData)) {
          this.state.locationData = mapResponseData;
          Geolocation.getCurrentPosition(loc => {
            const filteredLocations = this.state.locationData.filter(marker => {
              return (
                marker.latitude >=
                  loc.coords.latitude - constants.initialLatDelta / 2 &&
                marker.latitude <=
                  loc.coords.latitude + constants.initialLatDelta / 2 &&
                marker.longitude >=
                  loc.coords.longitude - constants.initialLongDelta / 2 &&
                marker.longitude <=
                  loc.coords.longitude + constants.initialLongDelta / 2
              );
            });
            this.setState({
              markers: filteredLocations,
            });
          });
          this.setState({
            loading: false, // Data has been loaded
          });
        } else {
          this.setState({loading: false}); // Set loading to false in case of an error
        }
      })
      .catch(error => {
        this.setState({loading: false}); // Set loading to false in case of an error
      });
  };

  getMyLocation = () => {
    Geolocation.getCurrentPosition(loc => {
      this.mapRef.animateToRegion({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
        latitudeDelta: constants.initialLatDelta,
        longitudeDelta: constants.initialLongDelta,
      });
      this.setState({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });
    });
  };
  handleRegionChangeComplete = region => {
    const {latitude, latitudeDelta, longitude, longitudeDelta} = region;
    if (latitudeDelta * 1000 > constants.maxZoomLevelValue) {
      this.setState({
        bottomTooFarMessage: true, // Data has been loaded
      });
    } else {
      this.setState({
        bottomTooFarMessage: false, // Data has been loaded
      });
      const filteredLocations = this.state.locationData.filter(marker => {
        return (
          marker.latitude >= latitude - latitudeDelta / 2 &&
          marker.latitude <= latitude + latitudeDelta / 2 &&
          marker.longitude >= longitude - longitudeDelta / 2 &&
          marker.longitude <= longitude + longitudeDelta / 2
        );
      });
      this.setState({
        markers: filteredLocations,
      });
    }
  };
  mapSection = () => {
    const selectLocation = location => {
      this.props.navigation.navigate('Location', {
        selectedLocation: location,
      });
    };
    return (
      <View style={styles.mapSectionMainView}>
        <MapView
          style={{...StyleSheet.absoluteFillObject}}
          customMapStyle={mapStyle}
          provider={PROVIDER_GOOGLE}
          onMapReady={() => {
            this.getMyLocation();
          }}
          showsUserLocation={true}
          showsMyLocationButton={true}
          showsCompass={true} // Hide compass button
          ref={ref => {
            this.mapRef = ref;
          }}
          onRegionChangeComplete={this.handleRegionChangeComplete}>
          {this.state.markers.map(marker => {
            return (
              <Marker
                key={marker.id}
                tracksViewChanges={false}
                coordinate={{
                  latitude: marker.latitude,
                  longitude: marker.longitude,
                }}>
                <View style={styles.markerImageMainView}>
                  <Image
                    source={markerImages[marker.category_id]}
                    style={styles.markerImage}
                  />
                </View>
                <Callout
                  style={styles.markerCallout}
                  onPress={() => {
                    selectLocation(marker);
                  }}>
                  <View style={styles.markerCalloutView}>
                    <Text>{marker.name}</Text>
                    <Text>{constants.btnMoreInfo}</Text>
                  </View>
                </Callout>
              </Marker>
            );
          })}
        </MapView>
      </View>
    );
  };

  // Main render part
  render() {
    return (
      <View style={styles.mapMainRenderView}>
        <View>{this.mapSection()}</View>

        {this.state.loading ? (
          // Show a loading indicator (e.g., a spinner)
          <View style={styles.bottomTextContainer}>
            <Text style={[styles.bottomText, styles.bottomTextInfo]}>
              {constants.msgFetchingFreshData}
            </Text>
          </View>
        ) : null}
        {this.state.bottomTooFarMessage ? (
          <View style={styles.bottomTextContainer}>
            <Text style={[styles.bottomText, styles.bottomTextError]}>
              {constants.msgZoomOutLimitReached}
            </Text>
          </View>
        ) : null}
      </View>
    );
  }
}
const mapStyle = [
  {
    featureType: 'administrative',
    elementType: 'geometry',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    featureType: 'poi',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    featureType: 'road',
    elementType: 'labels.icon',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
  {
    featureType: 'transit',
    stylers: [
      {
        visibility: 'off',
      },
    ],
  },
];
