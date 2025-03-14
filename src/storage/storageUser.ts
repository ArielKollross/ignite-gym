import AsyncStorage from "@react-native-async-storage/async-storage";

import type { UserDTO } from "@/dtos/UserDTO";
import { USER_STORAGE } from "./storageConfig";

export async function storageUserSave(user: UserDTO) {
	await AsyncStorage.setItem(USER_STORAGE, JSON.stringify(user));
}

export async function storageUserGet() {
	const storage = await AsyncStorage.getItem(USER_STORAGE);
	// console.log("storage", storage);
	const user: UserDTO = storage ? JSON.parse(storage) : {};

	// console.log("storageUserGet", user);

	return user;
}

export async function storageUserRemove() {
	await AsyncStorage.removeItem(USER_STORAGE);
}
