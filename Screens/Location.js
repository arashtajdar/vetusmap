import React from 'react';
import { View,StyleSheet, Image, Text} from 'react-native';

export default class Location extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            thisLocation: null
        }
    }
    componentDidMount = () => {
        let locationId = this.props.route.params.locationId;
        console.log(locationId)
        let selectedLocation = mapResponse.data.filter(g=> g.id === locationId) [0]
        console.log(selectedLocation);
        this.setState({
            thisLocation: selectedLocation
        })
        console.log(this.state.thisLocation)
        this.props.navigation.setOptions({title: selectedLocation.name})
    }

    render() {
        if(this.state.thisLocation != null){
            return (
                <View>
                    <Text>
                        {this.state.thisLocation.name}
                    </Text>
                </View>
            )
        }

    }
}
let mapResponse = {
    "current_page": 1,
    "data": [
        {
            "id": 1,
            "name": "Test hotel 001",
            "latitude": 41.906725,
            "longitude": 12.4597171,
            "description": "H001",
            "website": "www",
            "category_id": 1,
            "points": 0,
            "user_id": 1,
            "created_at": "2023-08-07T16:20:27.000000Z",
            "updated_at": null,
            "category": {
                "category_id": 1,
                "name": "Sustainable Hotels",
                "created_at": "2023-08-06T09:52:18.000000Z",
                "updated_at": "2023-08-06T09:52:18.000000Z"
            }
        },
        {
            "id": 2,
            "name": "Test hotel 002",
            "latitude": 41.8993271,
            "longitude": 12.4723767,
            "description": "H002",
            "website": "www2",
            "category_id": 1,
            "points": 0,
            "user_id": 1,
            "created_at": "2023-08-07T16:20:27.000000Z",
            "updated_at": null,
            "category": {
                "category_id": 1,
                "name": "Sustainable Hotels",
                "created_at": "2023-08-06T09:52:18.000000Z",
                "updated_at": "2023-08-06T09:52:18.000000Z"
            }
        }
    ],
    "first_page_url": "http://localhost/api/locations?page=1",
    "from": 1,
    "last_page": 1282,
    "last_page_url": "http://localhost/api/locations?page=1282",
    "links": [
        {
            "url": null,
            "label": "&laquo; Previous",
            "active": false
        },
        {
            "url": "http://localhost/api/locations?page=1",
            "label": "1",
            "active": true
        },
        {
            "url": "http://localhost/api/locations?page=2",
            "label": "2",
            "active": false
        },
        {
            "url": "http://localhost/api/locations?page=3",
            "label": "3",
            "active": false
        },
        {
            "url": "http://localhost/api/locations?page=4",
            "label": "4",
            "active": false
        },
        {
            "url": "http://localhost/api/locations?page=5",
            "label": "5",
            "active": false
        },
        {
            "url": "http://localhost/api/locations?page=6",
            "label": "6",
            "active": false
        },
        {
            "url": "http://localhost/api/locations?page=7",
            "label": "7",
            "active": false
        },
        {
            "url": "http://localhost/api/locations?page=8",
            "label": "8",
            "active": false
        },
        {
            "url": "http://localhost/api/locations?page=9",
            "label": "9",
            "active": false
        },
        {
            "url": "http://localhost/api/locations?page=10",
            "label": "10",
            "active": false
        },
        {
            "url": null,
            "label": "...",
            "active": false
        },
        {
            "url": "http://localhost/api/locations?page=1281",
            "label": "1281",
            "active": false
        },
        {
            "url": "http://localhost/api/locations?page=1282",
            "label": "1282",
            "active": false
        },
        {
            "url": "http://localhost/api/locations?page=2",
            "label": "Next &raquo;",
            "active": false
        }
    ],
    "next_page_url": "http://localhost/api/locations?page=2",
    "path": "http://localhost/api/locations",
    "per_page": 2,
    "prev_page_url": null,
    "to": 2,
    "total": 2563
}
