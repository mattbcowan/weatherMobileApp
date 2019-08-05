import React, { Component } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { WEATHER_API_KEY } from 'react-native-dotenv';
import Constants from 'expo-constants';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';

const customData = require('./customData.json')

const styles = StyleSheet.create({
    fill: {
        flex: 1,
    },
    container: {
        paddingLeft: '5%',
        paddingRight: '5%',
        paddingTop: '15%',
        flex: 1,
        justifyContent: 'space-between'
    },
    textContainer: {
        paddingBottom: '5%'
    },
    temp: {
        color: '#2d3436',
        fontWeight: 'bold',
        fontSize: 60,
        textAlign: 'right'
    },
    header: {
        color: '#2d3436',
        fontSize: 80,
        fontWeight: 'bold',
        lineHeight: 65,
        paddingTop: 20,
    },
    headerContainer: { 
        flexDirection: 'row', 
        justifyContent: 'space-between'
    },
    footer: {
        color: '#2d3436',
        fontSize: 20,
        fontWeight: 'bold'
    },
    emphasis: {
        color: "#00b894"
    }
})

export default class WeatherText extends Component {
    constructor(props){
        super(props);
        this.state = {
            temp_now: '',
            temp_min: '',
            temp_max: '',
            humidity: '',
            city: '',
            style: '',
            location: null,
            errorMessage: null
        }
    };

    componentWillMount() {
        if (Platform.OS === 'android' && !Constants.isDevice) {
            this.setState({
                errorMessage: "Won't work on Sketch in an Android Emulator"
            });
        } else {
            this._getLocationAsync()
            .then(() => {
                this.getWeather(this.state.location[0].postalCode)
            })
        }
    }

    _getLocationAsync = async () => {
        let { status } = await Permissions.askAsync(Permissions.LOCATION);
        if (status !== 'granted') {
            this.setState({
                errorMessage: 'Permission to access location was denied'
            });
        }

        let coords = await Location.getCurrentPositionAsync({});
        let location = await Location.reverseGeocodeAsync({"latitude": coords.coords.latitude, "longitude": coords.coords.longitude})
        this.setState({ location: location });
    }

    getDisplayType(temp, icon) {
        var cd = customData.phrases
        if (icon == "Fog") {
            return cd[8][this.getRandom(cd[8].length)]
        } else if (icon == "Thunderstorm") {
            return cd[7][this.getRandom(cd[7].length)]
        } else if (icon == "Rain") {
            return cd[6][this.getRandom(cd[6].length)]
        } else if (temp <= 32) {
            return cd[0][this.getRandom(cd[0].length)]
        } else if (temp > 32 && temp <= 45) {
            return cd[1][this.getRandom(cd[1].length)]
        } else if (temp > 45 && temp <= 60) {
            return cd[2][this.getRandom(cd[2].length)]
        } else if (temp > 60 && temp <= 80) {
            return cd[3][this.getRandom(cd[3].length)]
        } else if (temp > 80 && temp <= 90) {
            return cd[4][this.getRandom(cd[4].length)]
        } else if (temp > 90) {
            return cd[5][this.getRandom(cd[5].length)]
        } else {
            console.log("Couldn't retrieve temp")
        }
    }

    getRandom(max) {
        return Math.floor(Math.random() * Math.floor(max));
    }

    // Fix this logic. City isn't city anymore it's found by postal code
    getWeather(city) {
        const apiKey = WEATHER_API_KEY;
        var city = city;
        var location = this.state.location[0];
        let url = `http://api.openweathermap.org/data/2.5/weather?zip=${location.postalCode},${location.isoCountryCode}&appid=${apiKey}&units=imperial`
      
        return fetch(url)
          .then(response => response.json())
          .then(weather => {
            //   console.log(weather)
              var tempNow = Math.round(weather.main.temp)
            this.setState({ 
                temp_now: tempNow,
                temp_min: weather.main.temp_min,
                temp_max: weather.main.temp_max,
                humidity: weather.main.humidity,
                city: weather.name, 
                style: this.getDisplayType(tempNow, weather.weather[0].main)
            })
          })
          .catch(error => {
            console.log(error);
          });
    }

    render() {
        return (
            <View style={styles.fill}>
                <View style={styles.container}>
                        <View style={styles.headerContainer}>
                            <Feather name={this.state.style.icon} size={60} color="#2d3436" />
                            <Text style={styles.temp}>{this.state.temp_now}&deg;</Text>
                        </View>
                        <View style={styles.textContainer}>
                            <Text style={styles.header}>
                                {this.state.style.header1}
                                <Text style={styles.emphasis}>{this.state.style.emphasis}</Text>
                                {this.state.style.header2}
                            </Text>
                            <Text style={styles.footer}>{this.state.style.footer}</Text>
                        </View>
                    </View>
            </View>
        )
    }
}