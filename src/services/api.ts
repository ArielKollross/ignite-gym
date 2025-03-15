import {
	storageAuthTokenGet,
	storageAuthTokenSave,
} from "@/storage/storageAuthToken";
import { AppError } from "@/utils/AppError";
import axios, { type AxiosError, type AxiosInstance } from "axios";

type SignOut = () => void;

type PromiseType = {
	onSuccess: (token: string) => void;
	onFailure: (error: AxiosError) => void;
};

type APIInstanceProps = AxiosInstance & {
	registerInterceptTokenManager: (singOut: SignOut) => () => void;
};

const localHost = "http://192.168.0.130";
const api = axios.create({
	baseURL: `${localHost}:3333`,
}) as APIInstanceProps;

let failedQueue: Array<PromiseType> = [];

let isRefreshing = false;

api.registerInterceptTokenManager = (singOut) => {
	const interceptTokenManager = api.interceptors.response.use(
		(response) => response,
		async (RequestError) => {
			console.log(RequestError);
			if (RequestError?.response?.status === 401) {
				console.log(RequestError?.response?.data?.message);
				if (
					RequestError?.response?.data?.message === "token.expired" ||
					RequestError?.response?.data?.message === "token.invalid"
				) {
					const { refresh_token } = await storageAuthTokenGet();

					if (!refresh_token) {
						singOut();
						return Promise.reject(RequestError);
					}

					const originalConfig = RequestError.config;

					if (isRefreshing) {
						return new Promise((resolve, reject) => {
							failedQueue.push({
								onSuccess: (token: string) => {
									originalConfig.headers.Authorization = `Bearer ${token}`;
									resolve(api(originalConfig));
								},
								onFailure: (error: AxiosError) => {
									reject(error);
								},
							});
						});
					}

					isRefreshing = true;

					// biome-ignore lint/suspicious/noAsyncPromiseExecutor: <explanation>
					return new Promise(async (resolve, reject) => {
						try {
							const { data } = await api.post("/sessions/refresh-token", {
								refresh_token,
							});

							await storageAuthTokenSave({
								token: data.token,
								refresh_token: data.refresh_token,
							});

							console.log("originalConfig", originalConfig);

							if (originalConfig.data) {
								originalConfig.data = JSON.parse(originalConfig.data);
							}

							originalConfig.headers.Authorization = `Bearer ${data.token}`;
							api.defaults.headers.common.Authorization = `Bearer ${data.token}`;

							// biome-ignore lint/complexity/noForEach: <explanation>
							failedQueue.forEach((request) => {
								request.onSuccess(data.token);
							});

							console.log("token atualizado");

							resolve(api(originalConfig));
						} catch (error: any) {
							// biome-ignore lint/complexity/noForEach: <explanation>
							failedQueue.forEach((request) => {
								request.onFailure(error);
							});

							singOut();
							reject(error);
						} finally {
							isRefreshing = false;
							failedQueue = [];
						}
					});
				}

				singOut();
			}

			const hasMessage = RequestError.response?.data;

			const errorMessage = hasMessage
				? RequestError.response.data.message
				: RequestError;

			return Promise.reject(
				hasMessage ? errorMessage : new AppError(errorMessage),
			);
		},
	);

	return () => {
		api.interceptors.response.eject(interceptTokenManager);
	};
};

export { api };
