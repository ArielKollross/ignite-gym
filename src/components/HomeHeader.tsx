import { Heading, HStack, Text, VStack, Icon } from "@gluestack-ui/themed";
import { UserPhoto } from "./UserPhoto";
import { LogOut } from "lucide-react-native"

export function HomeHeader() {
    return (
        <HStack bg="$gray600" pt="$16" pb="$5" px="$8" alignItems="center" gap={"$4"}>
            <UserPhoto source={{ uri: 'https://github.com/arielkollross.png' }} alt="Imagem do Usuário" w="$16" h="$16" />

            <VStack flex={1}>
                <Text color="$gray100" fontSize="$sm">Home</Text>
                <Heading color="$gray100" fontSize="$md">Ariel Kollross</Heading>
            </VStack>

            <Icon as={LogOut} color="$gray200" size="xl" />
        </HStack >
    );
}