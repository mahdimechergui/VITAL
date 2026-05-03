import { useEffect } from 'react';
import { useWindowDimensions, View, StyleSheet } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withTiming, Easing } from 'react-native-reanimated';

type PulseLineProps = {
  health: number;
};

const getColor = (health: number) => {
  if (health >= 80) return '#06b6d4';
  if (health >= 50) return '#a855f7';
  return '#ec4899';
};

export function PulseLine({ health }: PulseLineProps) {
  const width = useWindowDimensions().width - 40;
  const dotX = useSharedValue(0);
  const color = getColor(health);
  const lineBars = [12, 18, 10, 24, 8, 30, 10, 18, 12, 8, 22, 10];

  useEffect(() => {
    dotX.value = withRepeat(
      withTiming(width, {
        duration: 2600,
        easing: Easing.linear,
      }),
      -1,
      false
    );
  }, [width, dotX]);

  const animatedDot = useAnimatedStyle(() => ({
    transform: [{ translateX: dotX.value }],
  }));

  return (
    <View style={styles.wrapper}>
      <View style={[styles.line, { borderColor: color }]}> 
        <View style={styles.barsContainer}>
          {lineBars.map((height, index) => (
            <View
              key={index}
              style={[
                styles.bar,
                {
                  height,
                  backgroundColor: color,
                  opacity: index % 2 === 0 ? 0.75 : 0.55,
                },
              ]}
            />
          ))}
        </View>
        <Animated.View style={[styles.dot, animatedDot, { backgroundColor: color, shadowColor: color }]} />
      </View>
      <View style={styles.footer}>
        <View style={[styles.statusPill, { backgroundColor: `${color}22` }]}>
          <View style={[styles.indicator, { backgroundColor: color }]} />
          <View>
            <Animated.Text style={[styles.statusText, { color }]}>{`System Health ${health}%`}</Animated.Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    marginVertical: 12,
  },
  line: {
    height: 72,
    width: '100%',
    borderWidth: 1,
    borderRadius: 18,
    paddingHorizontal: 10,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  barsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: '100%',
  },
  bar: {
    width: 8,
    borderRadius: 4,
  },
  dot: {
    position: 'absolute',
    left: 0,
    width: 14,
    height: 14,
    borderRadius: 8,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 12,
    elevation: 8,
    top: '50%',
    marginTop: -7,
  },
  footer: {
    marginTop: 12,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    gap: 8,
  },
  indicator: {
    width: 10,
    height: 10,
    borderRadius: 999,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '600',
  },
});
