import type { UserDTO } from "@/dtos/UserDTO";
import { api } from "@/services/api";
import { createContext, useState } from "react";

export type AuthContextDataProps = {
	user: UserDTO;
	signIn: (email: string, password: string) => Promise<void>;
};

type AuthContextProviderProps = {
	children: React.ReactNode;
};

export const AuthContext = createContext({} as AuthContextDataProps);

export function AuthContextProvider({ children }: AuthContextProviderProps) {
	const [user, setUser] = useState<UserDTO>({} as UserDTO);

	async function signIn(email: string, password: string) {
		try {
			const { data } = await api.post("/sessions", { email, password });
			console.log(data);

			if (data.user) {
				setUser(data.user);
			}
		} catch (error) {
			console.error(error);
		}
	}

	return (
		<AuthContext.Provider value={{ user, signIn }}>
			{children}
		</AuthContext.Provider>
	);
}
