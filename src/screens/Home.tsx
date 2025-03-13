import { ExerciseCard } from "@/components/ExerciseCard";
import { Group } from "@/components/Group";
import { HomeHeader } from "@/components/HomeHeader";
import { Loading } from "@/components/Loading";
import { ToastMessage } from "@/components/ToastMessage";
import type { ExerciseDTO } from "@/dtos/ExerciseDTO";
import type { AppNavigatorRoutesProps } from "@/routes/app.routes";
import { api } from "@/services/api";
import { AppError } from "@/utils/AppError";
import { Heading, HStack, Text, useToast, VStack } from "@gluestack-ui/themed";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useCallback, useEffect, useState } from "react";
import { FlatList } from "react-native";

export function Home() {
	const [isLoading, setIsLoading] = useState(true);
	const [exercises, setExercises] = useState<ExerciseDTO[]>([]);
	const [groups, setGroups] = useState<string[]>([]);
	const [groupSelected, setGroupSelected] = useState("antebraço");

	const toast = useToast();

	const navigation = useNavigation<AppNavigatorRoutesProps>();

	function handleOpenExerciseDetails(exerciseId: string) {
		navigation.navigate("exercise", { exerciseId });
	}

	async function fetchGroups() {
		try {
			const response = await api.get("/groups");
			setGroups(response.data);
		} catch (error) {
			const isAppError = error instanceof AppError;
			const title = isAppError ? error.message : "Erro ao buscar grupos";

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
		}
	}

	async function fetchExercisesByGroup() {
		try {
			setIsLoading(true);

			const response = await api.get(`/exercises/bygroup/${groupSelected}`);
			setExercises(response.data);
		} catch (error) {
			const isAppError = error instanceof AppError;
			const title = isAppError ? error.message : "Erro ao buscar exercícios";

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

	useEffect(() => {
		fetchGroups();
	}, []);

	useFocusEffect(
		useCallback(() => {
			fetchExercisesByGroup();
		}, [groupSelected]),
	);

	return (
		<VStack flex={1}>
			<HomeHeader />

			<FlatList
				data={groups}
				keyExtractor={(item) => item}
				renderItem={({ item }) => (
					<Group
						name={item}
						isActive={groupSelected.toLowerCase() === item.toLowerCase()}
						onPress={() => setGroupSelected(item)}
					/>
				)}
				horizontal
				showsHorizontalScrollIndicator={false}
				contentContainerStyle={{
					paddingHorizontal: 32,
				}}
				style={{
					marginVertical: 40,
					maxHeight: 44,
					minHeight: 44,
				}}
			/>

			{isLoading ? (
				<Loading />
			) : (
				<VStack px={"$8"} flex={1}>
					<HStack justifyContent="space-between" mb={"$8"}>
						<Heading color="$gray200" fontSize={"$lg"} fontFamily="$heading">
							Exercícios
						</Heading>
						<Text color="$gray200" fontSize={"$sm"} fontFamily="$heading">
							{exercises.length}
						</Text>
					</HStack>

					<FlatList
						data={exercises}
						keyExtractor={(item) => item.id}
						renderItem={({ item }) => (
							<ExerciseCard
								data={item}
								onPress={() => handleOpenExerciseDetails(item.id)}
							/>
						)}
						showsVerticalScrollIndicator={false}
						contentContainerStyle={{ paddingBottom: 20 }}
					/>
				</VStack>
			)}
		</VStack>
	);
}
