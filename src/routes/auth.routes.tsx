import { SignIn } from "@/screens/signIn";
import { SignUp } from "@/screens/SignUp";
import { createNativeStackNavigator, NativeStackNavigationProp } from "@react-navigation/native-stack";

type AuthRoutes = {
    SignIn: undefined;
    SignUp: undefined;
}

export type AuthNavigatorRoutesProps = NativeStackNavigationProp<AuthRoutes>;

const { Navigator, Screen } = createNativeStackNavigator<AuthRoutes>();

export function AuthRoutes() {
  return (
    <Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Screen name="SignIn" component={SignIn} />
      <Screen name="SignUp" component={SignUp} />
    </Navigator>
  );
}