import AsyncStorage from "@react-native-async-storage/async-storage";

import { AUTH_TOKEN_STORAGE } from "./storageConfig";

type storageAuthTokenProps = {
	token: string;
	refresh_token: string;
};

export async function storageAuthTokenSave({
	token,
	refresh_token,
}: storageAuthTokenProps) {
	await AsyncStorage.setItem(
		AUTH_TOKEN_STORAGE,
		JSON.stringify({ token, refresh_token }),
	);
}

export async function storageAuthTokenGet() {
	const response = await AsyncStorage.getItem(AUTH_TOKEN_STORAGE);

	console.info("storageAuthTokenGet", response);

	const { token, refresh_token }: storageAuthTokenProps = response
		? JSON.parse(response)
		: { token: "", refresh_token: "" };

	console.log("storageAuthTokenGet", token, refresh_token);

	return {
		token,
		refresh_token,
	};
}

export async function storageAuthTokenRemove() {
	await AsyncStorage.removeItem(AUTH_TOKEN_STORAGE);
}
