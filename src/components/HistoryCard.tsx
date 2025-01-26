import { Heading, HStack, Text, VStack } from "@gluestack-ui/themed";


export function HistoryCard() {
    return (
        <HStack
            w={"$full"}
            bg="$gray600"
            alignItems="center"
            justifyContent="space-between"
            px="$5"
            py={"$4"}
            mb={"$3"}
            rounded="$md"
        >
            <VStack flex={1} mr={"$5"}>
                <Heading color="$gray100" fontSize="$md" textTransform="capitalize" fontFamily="$heading">
                    Costas
                </Heading>

                <Text color="$gray100" fontSize={"$lg"} numberOfLines={2}>
                    Pernas, triceps
                </Text>
            </VStack>

            <Text color="$gray100" fontSize={"$md"}>
                9:13
            </Text>
        </HStack>
    )
}