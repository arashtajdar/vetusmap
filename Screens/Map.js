import React from 'react';
import {View, StyleSheet, Image, TouchableOpacity, ActivityIndicator} from 'react-native';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';
// import MapView from "react-native-map-clustering";
import {Marker, Callout} from 'react-native-maps';
import {Text, Icon, SearchBar, Button} from '@rneui/base';
import Geolocation from '@react-native-community/geolocation';
import axios from 'axios';
import {openDatabase} from 'react-native-sqlite-storage';

const db = openDatabase({
    name: 'vetus',
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
            latitude: 24.723456,
            longitude: 46.70095,
            markers: [],
            locationData: [],
            searchString: '',
            distance: 40,
            selectMarker: null,
            showSearchSection: false, // Add this state for showing/hiding the search section
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
                error => {
                    this.callApiToUpdateMap();
                },
            );
        });
    };


    // Functions
    callApiToUpdateMap = () => {
        console.log('calling api....');

        axios.get('https://2295a967-bf39-4526-948c-169b249616fd.mock.pstmn.io/api/locations')
            .then((response) => {
                const mapResponseData = response.data.data;
                if (Array.isArray(mapResponseData)) {
                    this.state.locationData = mapResponseData;
                    //
                    db.transaction(txn => {
                        txn.executeSql(
                            `drop table if exists locations; `,
                            [],
                            (sqlTxn, res) => {
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
                                        (sqlTxn, res) => {
                                            console.log('succesful');
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
                (sqlTxn, res) => {
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
                latitudeDelta: 0.01,
                longitudeDelta: 0.007,
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

    searchSection = () => {
        const handleSearchLocationsNames = () => {
            let filteredLocations = mapResponse.data.filter(g => g.name.toLowerCase().includes(this.state.searchString.toLowerCase()));
            this.setState({
                markers: filteredLocations,
            });
        };
        const handleReset = () => {
            this.setState({
                markers: mapResponse.data,
            });
        };

        return (
            <View style={{position: 'absolute', backgroundColor: '#123456', zIndex: 2}}>
                <Text style={{color: 'white', fontSize: 28, textAlign: 'center'}}>
                    Vetus Map
                </Text>
                <SearchBar
                    placeholder={'Search ...'}
                    ref={search => this.search = search}
                    onChangeText={(text) => {
                        this.setState({searchString: text});
                    }}
                    value={this.state.searchString}
                    lightTheme={true}
                    round={true}
                    containerStyle={{backgroundColor: 'biege'}}
                />
                <View style={{justifyContent: 'space-between', flexDirection: 'row'}}>
                    <Button
                        onPress={() => {
                            handleReset();
                        }}
                        containerStyle={{width: '49%', borderRadius: 5, marginHorizontal: 2}}
                    >
                        <Text style={{fontWeight: 'bold', color: 'white', fontSize: 20, marginTop: 5}}>RESET</Text>
                        <Icon name="refresh" color="white"></Icon>
                    </Button>
                    <Button
                        onPress={() => {
                            handleSearchLocationsNames();
                        }}
                        containerStyle={{width: '49%', borderRadius: 5, marginHorizontal: 2}}
                    >
                        <Text style={{fontWeight: 'bold', color: 'white', fontSize: 20, marginTop: 5}}>SEARCH</Text>
                        <Icon name="search" color="white"></Icon>
                    </Button>
                </View>
            </View>
        );
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
                             latitude: 6.8523,
                             longitude: 79.8895,
                             latitudeDelta: 0.0922,
                             longitudeDelta: 0.0421,
                         }}
                         minZoomLevel={16}
                         maxZoomLevel={20}
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
    toggleSearchSection = () => {
        this.setState((prevState) => ({
            showSearchSection: !prevState.showSearchSection,
        }));
    };

    // Main render part
    render() {
        return (
            <View style={{flexDirection: 'column', flex: 1}}>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity onPress={this.toggleSearchSection} style={styles.button}>
                        <Icon name="search" color="white" size={30}/>
                    </TouchableOpacity>
                </View>
                <View>
                    {this.state.showSearchSection && this.searchSection()}
                </View>
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
        fontSize: '12px',
    },
    loadingContainer: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.7)', // A semi-transparent background
        zIndex: 1, // Place the loading indicator above the map
    },

    bottomTextContainer: {
        position: 'absolute',
        bottom: 10, // Adjust this value to position the text as needed
        left: 10,
        right: 10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.7)', // A semi-transparent background
        zIndex: 1, // Place the text above the map
    },

    bottomText: {
        fontSize: 16,
        color: '#000000', // Adjust the color to your preference
        fontWeight: 'bold',
    },
    bottomTextInfo: {
        color: '#0aad00', // Adjust the color to your preference
    },
    bottomTextError: {
        color: '#f80025', // Adjust the color to your preference
    },
});
