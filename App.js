import React from 'react';
import { StyleSheet, View, Alert } from 'react-native';
import * as Location from "expo-location";
import axios from "axios";
import Loading from './Loading';
import Weather from './Weather';

const API_KEY = "0e84c3023b6b75dbd5730de7bcd21e5f"

export default class App extends React.Component {
  state = {
    isLoading: true
  };

  getWeather = async (lat, lon) => {
    const { data: { main: { temp }, weather } } = await axios.get(`http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`)
    this.setState({isLoading: false, temp: temp, condition: weather[0].main})
  }

  getLocation = async () => {
    try {
      await Location.requestPermissionsAsync();
      const {
        coords: { latitude, longitude },
      } = await Location.getCurrentPositionAsync();
      this.getWeather(latitude, longitude);
    } catch (error) {
      console.log(error);
      Alert.alert("Can't find you", "That's too bad");
    }
  };

  componentDidMount() {
    this.getLocation();
  }
  render() {
    const { isLoading } = this.state;

    return (
      isLoading ? <Loading /> : <Weather temp={Math.round(this.state.temp)} condition={this.state.condition} />
    );
  }
}
