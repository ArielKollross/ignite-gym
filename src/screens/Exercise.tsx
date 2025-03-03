import { AppNavigatorRoutesProps } from "@/routes/app.routes";
import { Image, Heading, HStack, Icon, Text, VStack, Box } from "@gluestack-ui/themed";
import { useNavigation } from "@react-navigation/native";
import { ArrowLeft } from "lucide-react-native";
import { ScrollView, TouchableOpacity } from "react-native";

import BodySvg from "@/assets/body.svg";
import SeriesSvg from "@/assets/series.svg";
import RepetitionsSvg from "@/assets/repetitions.svg";
import { Button } from "@/components/Button";

export function Exercise() {
    const navigation = useNavigation<AppNavigatorRoutesProps>();

    function handleGoBack() {
        navigation.goBack()
    }

    return (
        <VStack flex={1}>
            <VStack bg="$gray600" px={"$8"} pt={"$12"}>

                <TouchableOpacity onPress={handleGoBack}>
                    <Icon as={ArrowLeft} color="$green500" size="xl" />
                </TouchableOpacity>

                <HStack justifyContent="space-between" alignItems="center" mt={"$4"} mb={"$8"}>
                    <Heading color="$gray100" textTransform="capitalize" fontSize={"$lg"} fontFamily="$heading" flexShrink={1}>
                        Puxada frontal
                    </Heading>

                    <HStack alignItems="center">
                        <BodySvg />

                        <Text color="$gray200" ml={"$2"} textTransform="capitalize">
                            Costas
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
                        source={{ uri: "https://www.oxerbrasil.com.br/wp-content/uploads/2022/07/mulher-se-exercitando-lrQPTQs7nQQ-unsplash.jpg.webp" }}
                        alt="Imagem do exercicio"
                        w={"$full"}
                        h={"$80"}
                        mb={"$3"}
                        resizeMode="cover"
                        rounded={"$lg"}
                    />

                    <Box
                        bg="$gray600"
                        pb={"$4"}
                        px={"$4"}
                        rounded={"$md"}
                    >
                        <HStack alignItems="center" justifyContent="space-between" mb={"$6"} mt={"$5"}>
                            <HStack>
                                <SeriesSvg />
                                <Text color="$gray200" ml={"$2"} textTransform="capitalize">
                                    3 seríes
                                </Text>
                            </HStack>

                            <HStack>
                                <RepetitionsSvg />
                                <Text color="$gray200" ml={"$2"} textTransform="capitalize">
                                    12 repetições
                                </Text>
                            </HStack>
                        </HStack>

                        <Button title="Marcar como realizado" />
                    </Box>

                </VStack>
            </ScrollView>
        </VStack>
    )
}