import { ExerciseCard } from "@/components/ExerciseCard";
import { Group } from "@/components/Group";
import { HomeHeader } from "@/components/HomeHeader";
import { AppNavigatorRoutesProps } from "@/routes/app.routes";
import { Heading, HStack, Text, VStack } from "@gluestack-ui/themed";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { FlatList } from "react-native";

export function Home() {
    const [exercises, setExercises] = useState([
        'Puxada frontal',
        'Remada unilateral',
        'Remada unilateral',
        'Puxada frontal',
        'Remada unilateral',
        'Remada unilateral',
    ]);
    const [groups, setGroups] = useState([
        'costas',
        'peito',
        'ombro',
        'biceps',
        'triceps',
        'perna'
    ]);
    const [groupSelected, setGroupSelected] = useState('costas');

    const navigation = useNavigation<AppNavigatorRoutesProps>()

    function handleOpenExerciseDetails() {
        navigation.navigate("exercise")
    }


    return (
        <VStack flex={1}>
            <HomeHeader />

            <FlatList
                data={groups}
                keyExtractor={item => item}
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
                    paddingHorizontal: 32
                }}
                style={{
                    marginVertical: 40,
                    maxHeight: 44,
                    minHeight: 44,
                }}
            />

            <VStack px={"$8"} flex={1}>
                <HStack justifyContent="space-between" mb={"$8"}>
                    <Heading color="$gray200" fontSize={"$lg"} fontFamily="$heading">
                        Exercícios
                    </Heading>
                    <Text color="$gray200" fontSize={"$sm"} fontFamily="$heading">
                        {exercises.length}
                    </Text>
                </HStack>

            </VStack>

            <FlatList
                data={exercises}
                keyExtractor={item => item}
                renderItem={({ item }) => (
                    <ExerciseCard onPress={handleOpenExerciseDetails} />
                )}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 20 }}
            />
        </VStack >
    )
}