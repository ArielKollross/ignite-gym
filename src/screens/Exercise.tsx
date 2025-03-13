import type { AppNavigatorRoutesProps } from "@/routes/app.routes";
import {
	Image,
	Heading,
	HStack,
	Icon,
	Text,
	VStack,
	Box,
} from "@gluestack-ui/themed";
import { useNavigation, useRoute } from "@react-navigation/native";
import { ArrowLeft } from "lucide-react-native";
import { ScrollView, TouchableOpacity } from "react-native";
import BodySvg from "@/assets/body.svg";
import SeriesSvg from "@/assets/series.svg";
import RepetitionsSvg from "@/assets/repetitions.svg";
import { Button } from "@/components/Button";
import { AppError } from "@/utils/AppError";
import { useToast } from "@gluestack-ui/themed";
import { api } from "@/services/api";
import { ToastMessage } from "@/components/ToastMessage";
import { useEffect, useState } from "react";
import type { ExerciseDTO } from "@/dtos/ExerciseDTO";
import { Loading } from "@/components/Loading";

type RouteParamsProps = {
	exerciseId: string;
};

export function Exercise() {
	const [sendingRequest, setSendingRequest] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [exercise, setExercise] = useState<ExerciseDTO>({} as ExerciseDTO);
	const navigation = useNavigation<AppNavigatorRoutesProps>();

	const toast = useToast();

	const route = useRoute();
	const { exerciseId } = route.params as RouteParamsProps;

	function handleGoBack() {
		navigation.goBack();
	}

	async function fetchExerciseDetails() {
		try {
			setIsLoading(true);

			const response = await api.get(`/exercises/${exerciseId}`);
			setExercise(response.data);
		} catch (error) {
			const isAppError = error instanceof AppError;
			const title = isAppError ? error.message : "Erro ao buscar exercício";

			toast.show({
				placement: "top",
				render: ({ id }) => (
					<ToastMessage
						id={exerciseId}
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

	async function handleExerciseHistoryRegister() {
		try {
			setSendingRequest(true);
			await api.post("/history", { exercise_id: exerciseId });

			toast.show({
				placement: "top",
				render: ({ id }) => (
					<ToastMessage
						id={id}
						action="success"
						title="Exercício registrado com sucesso"
						onClose={() => toast.close(id)}
					/>
				),
			});

			navigation.navigate("history");
		} catch (error) {
			const isAppError = error instanceof AppError;
			const title = isAppError ? error.message : "Erro ao registrar exercício";

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
			setSendingRequest(false);
		}
	}

	useEffect(() => {
		fetchExerciseDetails();
	}, [exerciseId]);

	if (isLoading) {
		return <Loading />;
	}

	return (
		<VStack flex={1}>
			<VStack bg="$gray600" px={"$8"} pt={"$12"}>
				<TouchableOpacity onPress={handleGoBack}>
					<Icon as={ArrowLeft} color="$green500" size="xl" />
				</TouchableOpacity>

				<HStack
					justifyContent="space-between"
					alignItems="center"
					mt={"$4"}
					mb={"$8"}
				>
					<Heading
						color="$gray100"
						textTransform="capitalize"
						fontSize={"$lg"}
						fontFamily="$heading"
						flexShrink={1}
					>
						{exercise.name}
					</Heading>

					<HStack alignItems="center">
						<BodySvg />

						<Text color="$gray200" ml={"$2"} textTransform="capitalize">
							{exercise.group}
						</Text>
					</HStack>
				</HStack>
			</VStack>

			<ScrollView
				showsVerticalScrollIndicator={false}
				contentContainerStyle={{ paddingBottom: 32 }}
			>
				<VStack p={"$8"} flex={1}>
					<Image
						source={{
							uri: `${api.defaults.baseURL}/exercise/demo/${exercise?.demo}`,
						}}
						alt="Imagem do exercicio"
						w={"$full"}
						h={"$80"}
						mb={"$3"}
						resizeMode="cover"
						rounded={"$lg"}
					/>

					<Box bg="$gray600" pb={"$4"} px={"$4"} rounded={"$md"}>
						<HStack
							alignItems="center"
							justifyContent="space-between"
							mb={"$6"}
							mt={"$5"}
						>
							<HStack>
								<SeriesSvg />
								<Text color="$gray200" ml={"$2"} textTransform="capitalize">
									{exercise.series} séries
								</Text>
							</HStack>
							<HStack>
								<RepetitionsSvg />
								<Text color="$gray200" ml={"$2"} textTransform="capitalize">
									{exercise.series} séries
								</Text>
							</HStack>
							7
						</HStack>

						<Button
							title="Marcar como realizado"
							isLoading={sendingRequest}
							onPress={handleExerciseHistoryRegister}
						/>
					</Box>
				</VStack>
			</ScrollView>
		</VStack>
	);
}
