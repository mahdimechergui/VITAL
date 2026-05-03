import { Stack } from 'expo-router';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';

export default function AgentsLayout() {
  const colorScheme = useColorScheme();

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: '#09090b' },
        headerTintColor: Colors[colorScheme ?? 'light'].tint,
        contentStyle: { backgroundColor: '#050508' },
      }}
    >
      <Stack.Screen name="index" options={{ title: 'AI Hub' }} />
      <Stack.Screen name="architect" options={{ title: 'Architect Agent' }} />
      <Stack.Screen name="liaison" options={{ title: 'Liaison Agent' }} />
      <Stack.Screen name="archivist" options={{ title: 'Archivist Agent' }} />
      <Stack.Screen name="sentinel" options={{ title: 'Sentinel Agent' }} />
    </Stack>
  );
}
