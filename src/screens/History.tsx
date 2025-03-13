import { HistoryCard } from "@/components/HistoryCard";
import { ScreenHeader } from "@/components/ScreenHeader";
import { ToastMessage } from "@/components/ToastMessage";
import type { HistoryByDayDTO } from "@/dtos/HistoryByDayDTO";
import { api } from "@/services/api";
import { AppError } from "@/utils/AppError";
import { Center, Heading, useToast, VStack } from "@gluestack-ui/themed";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import { SectionList } from "react-native";

export function History() {
	const [isLoading, setIsLoading] = useState(true);
	const [exercises, setExercises] = useState<HistoryByDayDTO[]>([]);

	const toast = useToast();

	async function fetchHistory() {
		try {
			setIsLoading(true);

			const response = await api.get("/history");
			setExercises(response.data);
		} catch (error) {
			const isAppError = error instanceof AppError;
			const title = isAppError ? error.message : "Erro ao buscar histórico";

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

	useFocusEffect(
		// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
		useCallback(() => {
			fetchHistory();
		}, []),
	);

	return (
		<VStack flex={1}>
			<ScreenHeader title="Histórico" />
			<SectionList
				sections={exercises}
				keyExtractor={(item) => item.id}
				renderItem={({ item }) => <HistoryCard data={item} />}
				stickySectionHeadersEnabled
				renderSectionHeader={({ section: { title } }) => (
					<Heading
						color="$gray200"
						fontSize="$md"
						mt="$10"
						mb="$3"
						fontFamily="$heading"
					>
						{title}
					</Heading>
				)}
				style={{ paddingHorizontal: 32 }}
				contentContainerStyle={
					exercises.length === 0 && {
						flex: 1,
						justifyContent: "center",
						alignItems: "center",
					}
				}
				ListEmptyComponent={() => (
					<Center>
						<Heading
							color="$gray200"
							fontSize="$md"
							textAlign="center"
							fontFamily="$heading"
						>
							Não há exercícios registrados ainda.
						</Heading>
					</Center>
				)}
				showsVerticalScrollIndicator={false}
			/>
		</VStack>
	);
}
