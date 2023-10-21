import React from 'react';
import {View, StyleSheet, Image} from 'react-native';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';
// import MapView from "react-native-map-clustering";
import {Marker, Callout} from 'react-native-maps';
import {Text} from '@rneui/base';
import Geolocation from '@react-native-community/geolocation';
import axios from 'axios';
// noinspection ES6CheckImport
import {openDatabase} from 'react-native-sqlite-storage';

// Constants
const dbName = 'vetus';
const initialLat = 6.8523;
const initialLong = 79.8895;
const initialLatDelta = 0.01;
const initialLongDelta = 0.007;
const apiUrl = 'https://2295a967-bf39-4526-948c-169b249616fd.mock.pstmn.io/api/locations';
const minZoomLevelValue = 16;
const maxZoomLevelValue = 20;

const db = openDatabase({
    name: dbName,
    location: 'default',
}, () => {
    console.log('ok shod');
}, (error) => {
    console.log('db rid');
    console.log(error);
});

export default class Map extends React.Component {

    // Constructor
    constructor(props) {
        super(props);
        this.state = {
            latitude: initialLat,
            longitude: initialLong,
            markers: [],
            locationData: [],
            selectMarker: null,
            loading: true, // Initialize as loading
            bottomTooFarMessage: false, // Initialize as loading
        };
    }

    // component actions
    componentDidMount = () => {
        db.transaction(txn => {
            txn.executeSql(
                `SELECT *
                 from locations`,
                [],
                (sqlTxn, res) => {
                    if (res.rows.length) {
                        this.updateMapFromDb();
                    } else {
                        this.callApiToUpdateMap();
                    }
                },
                () => {
                    this.callApiToUpdateMap();
                },
            );
        });
    };


    // Functions
    callApiToUpdateMap = () => {
        console.log('calling api....');

        axios.get(apiUrl)
            .then((response) => {
                const mapResponseData = response.data.data;
                if (Array.isArray(mapResponseData)) {
                    this.state.locationData = mapResponseData;
                    db.transaction(txn => {
                        txn.executeSql(
                            `drop table if exists locations; `,
                            [],
                            () => {
                                console.log('dropped ! ok');
                                db.transaction(txn => {
                                    txn.executeSql(
                                        `create table if not exists locations
                                         (
                                             id          bigint unsigned auto_increment
                                                 primary key,
                                             name        varchar(255)    not null,
                                             latitude    decimal(10, 8)  not null,
                                             longitude   decimal(11, 8)  not null,
                                             description text            null,
                                             website     varchar(255)    null,
                                             category_id bigint unsigned not null,
                                             points      int default 0 not null,
                                             user_id     bigint unsigned null,
                                             created_at  timestamp       null,
                                             updated_at  timestamp       null
                                         )`,
                                        [],
                                        () => {
                                            console.log('successful');
                                            mapResponseData.map((data) => {
                                                this.insertIntoLocationsTable(data);
                                            });
                                        },
                                        error => {
                                            console.log('error on query : ' + error.message);
                                        },
                                    );
                                });

                            },
                            error => {
                                console.log('error on getting settings : ' + error.message);
                            },
                        );
                    });
                    this.setState({
                        loading: false, // Data has been loaded
                    });
                } else {
                    console.error('API response is not an array:', mapResponseData);
                    this.setState({loading: false}); // Set loading to false in case of an error
                }
            })
            .catch((error) => {
                console.error('Error fetching data from the API:', error);
                this.setState({loading: false}); // Set loading to false in case of an error
            });
    };

    updateMapFromDb = () => {
        console.log('no need to api call');

        db.transaction(txn => {
            txn.executeSql(
                `SELECT *
                 from locations`,
                [],
                (sqlTxn, res) => {
                    for (let i = 0; i < res.rows.length; i++) {
                        const row = res.rows.item(i);
                        this.insertIntoLocationDataVariable(row);
                    }
                    this.setState({loading: false}); // Set loading to false in case of an error

                },
                error => {
                    console.log('error on getting  : ' + error.message);
                    this.setState({loading: false}); // Set loading to false in case of an error

                },
            );
        });

    };
    insertIntoLocationDataVariable = (row) => {
        this.state.locationData.push({
            id: row.id,
            name: row.name,
            latitude: row.latitude,
            longitude: row.longitude,
            description: row.description,
            website: row.website,
            category_id: row.category_id,
            points: row.points,
            user_id: row.user_id,
            created_at: row.created_at,
            updated_at: row.updated_at,
        });


    };
    insertIntoLocationsTable = (data) => {
        db.transaction(txn => {
            txn.executeSql(
                `INSERT INTO locations (id, name, latitude, longitude, description, website, category_id, points,
                                        user_id,
                                        created_at, updated_at)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
                Object.values(data),
                () => {
                    // console.log('insert successful');
                },
                error => {
                    console.log('error on inserting locations into sqlite : ' + error.message);
                },
            );
        });
    };
    getMyLocation = () => {
        Geolocation.getCurrentPosition(loc => {
            this.mapRef.animateToRegion({
                latitude: loc.coords.latitude,
                longitude: loc.coords.longitude,
                latitudeDelta: initialLatDelta,
                longitudeDelta: initialLongDelta,
            });
            this.setState({
                latitude: loc.coords.latitude,
                longitude: loc.coords.longitude,
            });


        });
    };
    handleRegionChangeComplete = (region) => {


        // You can access the visible region data from the 'region' object.
        // console.log('Visible Region Data:', region);
        // You can store it in the state or perform any other actions as needed.

        const {latitude, latitudeDelta, longitude, longitudeDelta} = region;
        if (latitudeDelta * 1000 > 30) {
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
        const selectLocation = (location) => {
            this.props.navigation.navigate(
                'Location',
                {
                    locationId: location.id,
                },
            );
        };
        return (
            <View style={{height: '100%', paddingTop: 45, backgroundColor: '#123456'}}>
                <MapView style={{...StyleSheet.absoluteFillObject}}
                         provider={PROVIDER_GOOGLE}
                         onMapReady={() => {
                             this.getMyLocation();
                         }}
                         showsUserLocation={true}
                         showsMyLocationButton={true}
                         ref={(ref) => {
                             this.mapRef = ref;
                         }}
                         initialRegion={{
                             latitude: initialLat,
                             longitude: initialLong,
                             latitudeDelta: initialLatDelta,
                             longitudeDelta: initialLongDelta,
                         }}
                         minZoomLevel={minZoomLevelValue}
                         maxZoomLevel={maxZoomLevelValue}
                         onRegionChangeComplete={this.handleRegionChangeComplete} // Add this line
                >
                    {
                        this.state.markers.map((marker) => {
                            return (
                                <Marker
                                    key={marker.id}
                                    coordinate={{latitude: marker.latitude, longitude: marker.longitude}}
                                    image={require('../assets/images/markers/marker_1.png')}

                                >
                                    <Callout style={{height: 150, width: 150}} onPress={() => {
                                        selectLocation(marker);
                                    }}>
                                        <View style={{flex: 1, justifyContent: 'space-between'}}>
                                            <Text>{marker.name}</Text>
                                            <Text>{marker.category_id}</Text>
                                            <Image style={{width: 150, height: 100}}
                                                   source={require('../assets/images/nasoni.jpg')}></Image>
                                            <Text style={{fontStyle: 'italic'}}>Tap for more details...</Text>
                                        </View>
                                    </Callout>
                                </Marker>
                            );
                        })
                    }
                </MapView>
            </View>
        );
    };

    // Main render part
    render() {
        return (
            <View style={{flexDirection: 'column', flex: 1}}>
                <View>
                    {this.mapSection()}
                </View>

                {this.state.loading ? (
                    // Show a loading indicator (e.g., a spinner)
                    <View style={styles.bottomTextContainer}>
                        <Text style={[styles.bottomText, styles.bottomTextInfo]}>Fetching the fresh data ....</Text>
                    </View>
                ) : (
                    // Show a small text at the bottom when not loading
                    <View>
                    </View>
                )}
                {this.state.bottomTooFarMessage ? (
                    // Show a loading indicator (e.g., a spinner)
                    <View style={styles.bottomTextContainer}>
                        <Text style={[styles.bottomText, styles.bottomTextError]}>Please zoom in to show the
                            markers!</Text>
                    </View>
                ) : (
                    <View>
                    </View>
                )}
            </View>
        );
    }

}

// Styles
const styles = StyleSheet.create({
    buttonContainer: {
        position: 'absolute',
        top: 10,
        left: 10,
        zIndex: 3,
    },
    button: {
        backgroundColor: '#123456',
        padding: 10,
        borderRadius: 5,
    },
    sectionContainer: {
        marginTop: 32,
        paddingHorizontal: 24,
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: '600',
    },
    sectionDescription: {
        marginTop: 8,
        fontSize: 18,
        fontWeight: '400',
    },
    highlight: {
        fontWeight: '700',
    },
    absoluteFillObject: {
        fontSize: 12,  // Corrected type to number
    },
    loadingContainer: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        zIndex: 1,
    },
    bottomTextContainer: {
        position: 'absolute',
        bottom: 10,
        left: 10,
        right: 10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        zIndex: 1,
    },
    bottomText: {
        fontSize: 16,
        color: '#000000',
        fontWeight: 'bold',
    },
    bottomTextInfo: {
        color: '#0aad00',
    },
    bottomTextError: {
        color: '#f80025',
    },
});
