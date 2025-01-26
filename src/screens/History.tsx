import { HistoryCard } from "@/components/HistoryCard";
import { ScreenHeader } from "@/components/ScreenHeader";
import { Center, Heading, VStack } from "@gluestack-ui/themed";
import { useState } from "react";
import { SectionList } from "react-native";

export function History() {
    const [exercises, setExercises] = useState([
        {
            title: "22.03.2023",
            data: ["Puxada frontal", "Remada unilateral"]
        },
        {
            title: "22.03.2023",
            data: ["Puxada frontal"]
        },
    ]);
    return (
        <VStack flex={1}>
            <ScreenHeader title="Histórico" />
            <SectionList
                sections={exercises}
                renderItem={({ item }) => <HistoryCard />}
                stickySectionHeadersEnabled
                renderSectionHeader={({ section: { title } }) => (
                    <Heading color="$gray200" fontSize="$md" mt="$10" mb="$3" fontFamily="$heading">
                        {title}
                    </Heading>
                )}
                style={{ paddingHorizontal: 32 }}
                contentContainerStyle={exercises.length === 0 && { flex: 1, justifyContent: "center", alignItems: "center" }}
                ListEmptyComponent={() => (
                    <Center>
                        <Heading color="$gray200" fontSize="$md" textAlign="center" fontFamily="$heading">
                            Não há exercícios registrados ainda.
                        </Heading>
                    </Center>
                )}
                showsVerticalScrollIndicator={false}
            />
        </VStack>
    )
}