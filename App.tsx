import 'react-native-gesture-handler';
import React from 'react';
import Provider from './src/navigation/Provider';
import { LogBox } from 'react-native';

LogBox.ignoreAllLogs();//Hide all warning notifications on front-end

function App() {

  return (
     <Provider />
  );
}


export default App;
