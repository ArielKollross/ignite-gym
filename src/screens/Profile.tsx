import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { ScreenHeader } from "@/components/ScreenHeader";
import { UserPhoto } from "@/components/UserPhoto";
import { Center, Heading, Text, useToast, VStack } from "@gluestack-ui/themed";
import { Alert, ScrollView, TouchableOpacity } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { useState } from "react";
import { ToastMessage } from "@/components/ToastMessage";
import { useForm, Controller } from "react-hook-form";
import { useAuth } from "@/hooks/useAuth";
import { AppError } from "@/utils/AppError";
import { api } from "@/services/api";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Loading } from "@/components/Loading";
import DefaultImage from "@/assets/userPhotoDefault.png";

type FormDataProps = {
	name: string;
	password: string;
	old_password: string;
	confirm_password: string;
	email: string;
};

const profileSchema = yup.object({
	// name: yup.string().required("Informe o nome"),
	// password: yup
	// 	.string()
	// 	.min(6, "A senha deve ter pelo menos 6 dígitos.")
	// 	.nullable()
	// 	// biome-ignore lint/complexity/noExtraBooleanCast: <explanation>
	// 	.transform((value) => (value ? value : null)),
	// old_password: yup.string().nullable(),
	// confirm_password: yup
	// 	.string()
	// 	.nullable()
	// 	.transform((value) => (value ? value : null))
	// 	.oneOf([yup.ref("password"), null], "A confirmação de senha não confere.")
	// 	.when("password", (password, schema) => {
	// 		return password
	// 			? yup
	// 					.string()
	// 					.nullable()
	// 					.required("Informe a confirmação da senha.")
	// 					.transform((value) => (value ? value : null))
	// 			: yup
	// 					.string()
	// 					.nullable()
	// 					.transform((value) => (value ? value : null));
	// 	}),
	name: yup.string().required("Informe o nome"),
	password: yup
		.string()
		.min(6, "A senha deve ter pelo menos 6 dígitos.")
		.nullable()
		.transform((value) => (!!value ? value : null)),
	confirm_password: yup
		.string()
		.nullable()
		.transform((value) => (!!value ? value : null))
		.oneOf([yup.ref("password"), null], "A confirmação de senha não confere.")
		.when("password", {
			is: (Field: any) => Field,
			then: yup
				.string()
				.nullable()
				.required("Informe a confirmação da senha.")
				.transform((value) => (!!value ? value : null)),
		}),
});

export function Profile() {
	const [isUpdating, setIsUpdating] = useState(false);
	const [photoIsLoading, setPhotoIsLoading] = useState(false);

	const toast = useToast();
	const { user, updateUserProfile } = useAuth();
	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm<FormDataProps>({
		defaultValues: {
			name: user.name,
			email: user.email,
		},
		resolver: yupResolver(profileSchema),
	});

	async function handlerUserPhotoSelect() {
		try {
			setPhotoIsLoading(true);

			const photoSelected = await ImagePicker.launchImageLibraryAsync({
				mediaTypes: ImagePicker.MediaTypeOptions.Images,
				quality: 1,
				aspect: [4, 4],
				allowsEditing: true,
			});

			if (photoSelected.canceled) return;

			const photoUri = photoSelected.assets[0].uri;

			if (!photoUri) return;

			const photoInfo = (await FileSystem.getInfoAsync(photoUri)) as {
				size: number;
			};

			if (photoInfo.size && photoInfo.size / 1024 / 1024 > 5) {
				return toast.show({
					placement: "top",
					render: ({ id }) => (
						<ToastMessage
							id={id}
							action="error"
							title="Selecione uma imagem até 5Mb"
							onClose={() => toast.close(id)}
						/>
					),
				});
			}

			const fileExtension = photoUri.split(".").pop();

			const photoFile = {
				name: `${user.name}.${fileExtension}`.toLowerCase(),
				uri: photoUri,
				type: `image/${fileExtension}`,
				// biome-ignore lint/suspicious/noExplicitAny: <explanation>
			} as any;

			const userPhotoUploadForm = new FormData();
			userPhotoUploadForm.append("avatar", photoFile);

			const avatarUpdateResponse = await api.patch(
				"/users/avatar",
				userPhotoUploadForm,
				{
					headers: {
						"Content-Type": "multipart/form-data",
					},
				},
			);

			const userUpdated = user;
			userUpdated.avatar = avatarUpdateResponse.data.avatar;

			await updateUserProfile(userUpdated);

			toast.show({
				placement: "top",
				render: ({ id }) => (
					<ToastMessage
						id={id}
						action="success"
						title="Foto atualizada com sucesso"
						onClose={() => toast.close(id)}
					/>
				),
			});
		} catch (error) {
			console.error(error);
		} finally {
			setPhotoIsLoading(false);
		}
	}

	async function handleProfileUpdate(data: FormDataProps) {
		try {
			setIsUpdating(true);

			const userUpdated = user;
			userUpdated.name = data.name;

			await api.put("/users", data);

			await updateUserProfile(userUpdated);

			toast.show({
				placement: "top",
				render: ({ id }) => (
					<ToastMessage
						id={id}
						action="success"
						title="Perfil atualizado com sucesso"
						onClose={() => toast.close(id)}
					/>
				),
			});
		} catch (error) {
			const isAppError = error instanceof AppError;
			const title = isAppError ? error.message : "Erro ao atualizar perfil";

			toast.show({
				placement: "top",
				render: ({ id }) => (
					<ToastMessage
						id={id}
						action="error"
						title={title}
						onClose={() => toast.close(id)}
					/>
				),
			});
		} finally {
			setIsUpdating(false);
		}
	}

	if (isUpdating || photoIsLoading) {
		return <Loading />;
	}

	return (
		<VStack flex={1}>
			<ScreenHeader title="Perfil" />

			<ScrollView contentContainerStyle={{ paddingBottom: 36 }}>
				<Center mt={"$6"} px={"$10"}>
					<UserPhoto
						source={
							user?.avatar
								? { uri: `${api.defaults.baseURL}/avatar/${user.avatar}` }
								: DefaultImage
						}
						alt="Imagem do Usuário"
						size="xl"
					/>

					<TouchableOpacity onPress={handlerUserPhotoSelect}>
						<Text
							color="$green500"
							fontFamily="$heading"
							fontSize="$md"
							mt={"$2"}
							mb={"$8"}
						>
							Alterar foto
						</Text>
					</TouchableOpacity>

					<Center w={"$full"} gap={"$4"}>
						<Center w={"$full"} gap={"$4"}>
							<Controller
								control={control}
								name="name"
								render={({ field: { onChange, value } }) => (
									<Input
										placeholder="Nome"
										bg="$gray600"
										onChangeText={onChange}
										value={value}
										errorMessage={errors.name?.message}
									/>
								)}
							/>

							<Controller
								control={control}
								name="email"
								render={({ field: { onChange, value } }) => (
									<Input
										placeholder="Email"
										bg="$gray600"
										isReadOnly
										onChangeText={onChange}
										value={value}
									/>
								)}
							/>
						</Center>

						<Heading
							color="$gray200"
							fontSize="$md"
							fontFamily="$heading"
							mt={"$12"}
							mb={"$2"}
						>
							Alterar senha
						</Heading>

						<Controller
							control={control}
							name="old_password"
							render={({ field: { onChange, value } }) => (
								<Input
									placeholder="Senha antiga"
									bg="$gray600"
									secureTextEntry
									onChangeText={onChange}
									value={value}
								/>
							)}
						/>

						<Controller
							control={control}
							name="password"
							render={({ field: { onChange, value } }) => (
								<Input
									placeholder="Senha"
									bg="$gray600"
									secureTextEntry
									onChangeText={onChange}
									value={value}
									errorMessage={errors.password?.message}
								/>
							)}
						/>

						<Controller
							control={control}
							name="confirm_password"
							render={({ field: { onChange, value } }) => (
								<Input
									placeholder="Confirme a senha"
									bg="$gray600"
									secureTextEntry
									onChangeText={onChange}
									value={value}
									errorMessage={errors.confirm_password?.message}
								/>
							)}
						/>
					</Center>

					<Button
						title="Atualizar"
						mt={"$8"}
						onPress={handleSubmit(handleProfileUpdate)}
					/>
				</Center>
			</ScrollView>
		</VStack>
	);
}
