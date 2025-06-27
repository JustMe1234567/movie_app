import { Stack } from "expo-router";
import "./global.css";
export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "#161622" },
      }}
    >
      <Stack.Screen
        name="(tabs)"
        options={{
          headerShown: false,
          contentStyle: { backgroundColor: "#161622" },
        }}
      />
      <Stack.Screen
        name="movies/[id]"
        options={{
          headerShown: false,
          contentStyle: { backgroundColor: "#161622" },
        }}
      ></Stack.Screen>
    </Stack>
  );
}
