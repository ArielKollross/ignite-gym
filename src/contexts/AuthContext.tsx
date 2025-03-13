import type { UserDTO } from "@/dtos/UserDTO";
import { api } from "@/services/api";
import {
	storageAuthTokenGet,
	storageAuthTokenRemove,
	storageAuthTokenSave,
} from "@/storage/storageAuthToken";
import {
	storageUserSave,
	storageUserGet,
	storageUserRemove,
} from "@/storage/storageUser";
import { createContext, useEffect, useState } from "react";

export type AuthContextDataProps = {
	user: UserDTO;
	updateUserProfile: (userUpdated: UserDTO) => Promise<void>;
	isLoadingUserStorage: boolean;
	signIn: (email: string, password: string) => Promise<void>;
	signOut: () => Promise<void>;
};

type AuthContextProviderProps = {
	children: React.ReactNode;
};

export const AuthContext = createContext({} as AuthContextDataProps);

export function AuthContextProvider({ children }: AuthContextProviderProps) {
	const [user, setUser] = useState<UserDTO>({} as UserDTO);
	const [isLoadingUserStorage, setIsLoadingUserStorage] = useState(false);

	async function userAndTokenUpdate(user: UserDTO, token: string) {
		api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

		setUser(user);
	}

	async function storageUserAndTokenSave(user: UserDTO, token: string) {
		try {
			setIsLoadingUserStorage(true);
			await Promise.all([storageUserSave(user), storageAuthTokenSave(token)]);
		} catch (error) {
			console.error(error);
			throw error;
		} finally {
			setIsLoadingUserStorage(false);
		}
	}

	async function signIn(email: string, password: string) {
		try {
			setIsLoadingUserStorage(true);

			const { data } = await api.post("/sessions", { email, password });
			console.log(data);

			if (data.user && data.token) {
				await storageUserAndTokenSave(data.user, data.token);

				userAndTokenUpdate(data.user, data.token);
			}
		} catch (error) {
			console.error(error);
			throw error;
		} finally {
			setIsLoadingUserStorage(false);
		}
	}

	async function signOut() {
		try {
			setIsLoadingUserStorage(true);
			setUser({} as UserDTO);
			await Promise.all([storageUserRemove(), storageAuthTokenRemove()]);
		} catch (error) {
			console.error(error);
			throw error;
		} finally {
			setIsLoadingUserStorage(false);
		}
	}

	async function loadUserData() {
		try {
			setIsLoadingUserStorage(true);

			const [userStorage, token] = await Promise.all([
				storageUserGet(),
				storageAuthTokenGet(),
			]);

			if (token && userStorage) {
				userAndTokenUpdate(userStorage, token);
			}
		} catch (error) {
			console.error(error);
		} finally {
			setIsLoadingUserStorage(false);
		}
	}

	async function updateUserProfile(userUpdated: UserDTO) {
		try {
			setUser(userUpdated);
			await storageUserSave(userUpdated);
		} catch (error) {
			console.error(error);
			throw error;
		}
	}

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		loadUserData();
	}, []);

	return (
		<AuthContext.Provider
			value={{ user, signIn, isLoadingUserStorage, signOut, updateUserProfile }}
		>
			{children}
		</AuthContext.Provider>
	);
}
