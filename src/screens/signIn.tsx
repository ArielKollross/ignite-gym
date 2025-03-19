import {
	VStack,
	Image,
	Center,
	Text,
	Heading,
	ScrollView,
	useToast,
} from "@gluestack-ui/themed";

import BackgroundImage from "@/assets/background.png";
import Logo from "@/assets/logo.svg";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";

import { useNavigation } from "@react-navigation/native";
import type { AuthNavigatorRoutesProps } from "@/routes/auth.routes";
import { Controller, useForm } from "react-hook-form";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import { AppError } from "@/utils/AppError";
import { ToastMessage } from "@/components/ToastMessage";

type FormData = {
	email: string;
	password: string;
};

export function SignIn() {
	const { signIn } = useAuth();
	const [isLoading, setIsLoading] = useState(false);
	const navigation = useNavigation<AuthNavigatorRoutesProps>();
	const toast = useToast();

	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm<FormData>();

	function handleNewAccount() {
		navigation.navigate("SignUp");
	}

	async function handleSignIn({ email, password }: FormData) {
		try {
			setIsLoading(true);

			await signIn(email, password);
		} catch (error) {
			console.error(error);
			const isAppError = error instanceof AppError;

			const title =
				isAppError && typeof error.message === "string"
					? error.message
					: "Ops, algo deu errado. Tente novamente";

			console.log(title);

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
			setIsLoading(false);
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
					source={BackgroundImage}
					defaultSource={BackgroundImage}
					alt="Pessoas treinanda na academia"
					position="absolute"
				/>

				<VStack flex={1} px="$10" pb="$10">
					<Center my="$24">
						<Logo />

						<Text color="$gray100" fontSize="$sm">
							Treine sua mente e seu corpo
						</Text>
					</Center>

					<Center gap="$2">
						<Heading color="$gray100">Acesse a conta</Heading>

						<Controller
							control={control}
							name="email"
							rules={{ required: "Informe o e-mail" }}
							render={({ field: { onChange } }) => (
								<Input
									placeholder="E-mail"
									keyboardType="email-address"
									autoCapitalize="none"
									onChangeText={onChange}
									errorMessage={errors.email?.message}
								/>
							)}
						/>

						<Controller
							control={control}
							name="password"
							rules={{ required: "Informe a senha" }}
							render={({ field: { onChange } }) => (
								<Input
									placeholder="Senha"
									secureTextEntry
									onChangeText={onChange}
									errorMessage={errors.password?.message}
								/>
							)}
						/>

						<Button
							title="Acessar"
							onPress={handleSubmit(handleSignIn)}
							isLoading={isLoading}
						/>
					</Center>

					<Center flex={1} justifyContent="flex-end" marginTop="$4">
						<Text color="$gray100" fontSize="$sm" mb="$3" fontFamily="$body">
							Ainda não tem acesso?
						</Text>
						<Button
							onPress={handleNewAccount}
							title="Criar conta"
							variant="outline"
						/>
					</Center>
				</VStack>
			</VStack>
		</ScrollView>
	);
}
