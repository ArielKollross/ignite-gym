import { Exercise } from "@/screens/Exercise";
import { History } from "@/screens/History";
import { Home } from "@/screens/Home";
import { Profile } from "@/screens/Profile";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

const { Navigator, Screen } = createBottomTabNavigator();

export function AppRoutes() {
  return (
    <Navigator>
      <Screen name="Home" component={Home} />
      <Screen name="History" component={History} />
      <Screen name="Profile" component={Profile} />
      <Screen name="Exercise" component={Exercise} />
    </Navigator>
  );
}