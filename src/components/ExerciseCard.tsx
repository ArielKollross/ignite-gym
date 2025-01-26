import { Heading, HStack, Icon, Image, Text, VStack } from "@gluestack-ui/themed";
import { ChevronRight } from "lucide-react-native";
import { TouchableOpacity, TouchableOpacityProps } from "react-native";

type Props = TouchableOpacityProps & {

}

export function ExerciseCard({ ...rest }: Props) {
    return (<TouchableOpacity {...rest}>
        <HStack bg="$gray500" alignItems="center" p="$2" pr={"$4"} mb={"$3"} rounded="$md">
            <Image
                source={{ uri: "https://www.oxerbrasil.com.br/wp-content/uploads/2022/07/mulher-se-exercitando-lrQPTQs7nQQ-unsplash.jpg.webp" }}
                alt="Imagem do exercicio"
                w="$16"
                h="$16"
                rounded="$md"
                mr="$4"
                resizeMode="cover"
            />

            <VStack flex={1}>
                <Heading fontSize="$lg" color="$gray200" fontFamily="$heading">
                    Puxada frontal
                </Heading>

                <Text color="$gray200" fontSize="$sm" mt={"$1"} numberOfLines={2}>
                    3 séries x de 12 repetições
                </Text>
            </VStack>

            <Icon as={ChevronRight} color="$gray300" />
        </HStack>
    </TouchableOpacity>)
}