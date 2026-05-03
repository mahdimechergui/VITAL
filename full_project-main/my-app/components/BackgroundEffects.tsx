import React, { useEffect } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withRepeat, 
  withTiming, 
  Easing,
  interpolate
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

export const BackgroundEffects = () => {
  const pulseX = useSharedValue(-100);

  useEffect(() => {
    pulseX.value = withRepeat(
      withTiming(width + 100, {
        duration: 3500,
        easing: Easing.linear,
      }),
      -1,
      false
    );
  }, []);

  const animatedPulseStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: pulseX.value }],
    };
  });

  return (
    <View style={StyleSheet.absoluteFill}>
      {/* Base Gradient */}
      <LinearGradient
        colors={['#050508', '#0f172a', '#050508']}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      {/* Subtle Glow Blobs */}
      <View style={[styles.glow, { top: -100, left: -100, backgroundColor: '#3b82f633' }]} />
      <View style={[styles.glow, { bottom: -100, right: -100, backgroundColor: '#a855f722' }]} />

      {/* Pulse Line Container */}
      <View style={styles.pulseContainer}>
        <View style={styles.baseLine} />
        <Animated.View style={[styles.movingPulse, animatedPulseStyle]}>
          <View style={styles.pulseSpike} />
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  glow: {
    position: 'absolute',
    width: 400,
    height: 400,
    borderRadius: 200,
  },
  pulseContainer: {
    position: 'absolute',
    top: height * 0.4,
    left: 0,
    right: 0,
    height: 40,
    justifyContent: 'center',
    opacity: 0.15,
  },
  baseLine: {
    height: 1,
    backgroundColor: '#3b82f6',
    width: '100%',
  },
  movingPulse: {
    position: 'absolute',
    width: 60,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pulseSpike: {
    width: 20,
    height: 30,
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderTopWidth: 2,
    borderColor: '#60a5fa',
    backgroundColor: 'transparent',
    transform: [{ rotate: '45deg' }, { scaleY: 1.5 }],
  }
});
