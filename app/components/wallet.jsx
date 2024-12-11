import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import Svg, { Path } from 'react-native-svg';

const { height, width } = Dimensions.get("screen");

const Wallet = ({ amount }) => {
  return (
    <View>
      <Svg width={width * 0.14} height={height * 0.14} viewBox="0 0 54 44" fill="none" xmlns="http://www.w3.org/2000/svg">
        <Path
          d="M47 8H48V7V4.5C48 3.57174 47.6313 2.6815 46.9749 2.02513C46.3185 1.36875 45.4283 1 44.5 1H7C3.69772 1 1 3.69772 1 7V37C1 38.5913 1.63214 40.1174 2.75736 41.2426C3.88258 42.3679 5.4087 43 7 43H47C48.5913 43 50.1174 42.3679 51.2426 41.2426C52.3679 40.1174 53 38.5913 53 37V12C53 11.0717 52.6313 10.1815 51.9749 9.52513C51.3185 8.86875 50.4283 8.5 49.5 8.5H8V8H47ZM45.1945 27.6945C44.6788 28.2103 43.9793 28.5 43.25 28.5C42.5207 28.5 41.8212 28.2103 41.3055 27.6945C40.7897 27.1788 40.5 26.4793 40.5 25.75C40.5 25.0207 40.7897 24.3212 41.3055 23.8055C41.8212 23.2897 42.5207 23 43.25 23C43.9793 23 44.6788 23.2897 45.1945 23.8055C45.7103 24.3212 46 25.0207 46 25.75C46 26.4793 45.7103 27.1788 45.1945 27.6945Z"
          fill="#00ADB5"
          stroke="white"
          strokeWidth={width * 0.003}
        />
      </Svg>
      
      <Text style={{
        position: 'absolute',
        fontSize: width * 0.035, 
        bottom : "40%",
        left : "16%",
        color: 'white',
        fontFamily: 'JosefinSans-SemiBold',
      }}>
        {amount}
      </Text>
    </View>
  );
};

export default Wallet;
