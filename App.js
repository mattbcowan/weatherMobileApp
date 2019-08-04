import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import WeatherText from './components/weatherText.js'


export default function App() {
  return (
    <View style={styles.container}>
      <WeatherText />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    resizeMode: 'cover'
  },
});