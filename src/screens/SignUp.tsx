import {
	Center,
	Heading,
	Image,
	ScrollView,
	Text,
	useToast,
	VStack,
} from "@gluestack-ui/themed";
import BackgroundImg from "@/assets/background.png";
import Logo from "@/assets/logo.svg";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { useNavigation } from "@react-navigation/native";
import type { AuthNavigatorRoutesProps } from "@/routes/auth.routes";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { api } from "@/services/api";
import { AppError } from "@/utils/AppError";
import { ToastMessage } from "@/components/ToastMessage";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";

type FormDataProps = {
	name: string;
	email: string;
	password: string;
	password_confirm: string;
};

const signUpSchema = yup.object({
	name: yup.string().required("Informe o nome"),
	email: yup.string().required("Informe o e-mail").email("Email inválido"),
	password: yup
		.string()
		.required("Informe a senha")
		.min(6, "A senha deve conter o mínimo de 6 digitos"),
	password_confirm: yup
		.string()
		.required("Confirme a senha")
		.oneOf([yup.ref("password"), ""], "As senhas não conferem"),
});

export function SignUp() {
	const [isLoading, setIsLoading] = useState(false);

	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm<FormDataProps>({
		resolver: yupResolver(signUpSchema),
	});

	const toast = useToast();

	const { signIn } = useAuth();

	const navigation = useNavigation<AuthNavigatorRoutesProps>();

	function handleLogin() {
		navigation.goBack();
	}

	async function handleSignUp({ name, email, password }: FormDataProps) {
		try {
			setIsLoading(true);

			await api.post("/users", {
				name,
				email,
				password,
			});

			await signIn(email, password);
		} catch (error) {
			console.error(error);
			setIsLoading(false);

			const isAppError = error instanceof AppError;
			const title =
				isAppError && typeof error.message === "string"
					? error.message
					: "Ops, algo deu errado. Tente novamente";

			return toast.show({
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
		}
	}

	return (
		<ScrollView
			contentContainerStyle={{ flexGrow: 1 }}
			showsVerticalScrollIndicator={false}
		>
			<VStack flex={1}>
				<Image
					w="$full"
					h={624}
					source={BackgroundImg}
					defaultSource={BackgroundImg}
					alt="Pessoas treinando"
					position="absolute"
				/>
				<VStack flex={1} px="$10" pb="$16">
					<Center my="$24">
						<Logo />
						<Text color="$gray100" fontSize="$sm">
							Treine sua mente e seu corpo
						</Text>
					</Center>
					<Center flex={1} gap="$2">
						<Heading color="$gray100">Crie sua conta</Heading>

						<Controller
							control={control}
							name="name"
							render={({ field: { onChange, value } }) => (
								<Input
									placeholder="Nome"
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
									placeholder="E-mail"
									keyboardType="email-address"
									autoCapitalize="none"
									onChangeText={onChange}
									value={value}
									errorMessage={errors.email?.message}
								/>
							)}
						/>

						<Controller
							control={control}
							name="password"
							render={({ field: { onChange, value } }) => (
								<Input
									placeholder="Senha"
									secureTextEntry
									onChangeText={onChange}
									value={value}
									errorMessage={errors.password?.message}
								/>
							)}
						/>

						<Controller
							control={control}
							name="password_confirm"
							render={({ field: { onChange, value } }) => (
								<Input
									placeholder="Confirme a senha"
									secureTextEntry
									onChangeText={onChange}
									value={value}
									onSubmitEditing={handleSubmit(handleSignUp)}
									returnKeyType="send"
									errorMessage={errors.password_confirm?.message}
								/>
							)}
						/>

						<Button
							title="Criar e acessar"
							isLoading={isLoading}
							onPress={handleSubmit(handleSignUp)}
						/>
					</Center>
					<Button
						onPress={handleLogin}
						title="Voltar para o login"
						variant="outline"
						mt="$12"
					/>
				</VStack>
			</VStack>
		</ScrollView>
	);
}
