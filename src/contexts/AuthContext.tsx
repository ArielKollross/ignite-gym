import type { UserDTO } from "@/dtos/UserDTO";
import { api } from "@/services/api";
import {
	storageUserSave,
	storageUserGet,
	storageUserRemove,
} from "@/storage/storageUser";
import { createContext, useEffect, useState } from "react";

export type AuthContextDataProps = {
	user: UserDTO;
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

	async function signIn(email: string, password: string) {
		setIsLoadingUserStorage(true);
		try {
			const { data } = await api.post("/sessions", { email, password });
			console.log(data);

			if (data.user && data.token) {
				setUser(data.user);
				storageUserSave(data.user);
				setIsLoadingUserStorage(false);
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
			await storageUserRemove();
		} catch (error) {
			console.error(error);
			throw error;
		} finally {
			setIsLoadingUserStorage(false);
		}
	}

	async function loadUserData() {
		const userStorage = await storageUserGet();

		if (userStorage) {
			setUser(userStorage);
		}
	}

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		loadUserData();
	}, []);

	return (
		<AuthContext.Provider
			value={{ user, signIn, isLoadingUserStorage, signOut }}
		>
			{children}
		</AuthContext.Provider>
	);
}
