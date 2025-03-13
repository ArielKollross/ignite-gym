import type { HistoryDTO } from "@/dtos/HistoryDTO";
import { Heading, HStack, Text, VStack } from "@gluestack-ui/themed";

type HistoryCardProps = {
	data: HistoryDTO;
};

export function HistoryCard({ data }: HistoryCardProps) {
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
				<Heading
					color="$gray100"
					fontSize="$md"
					textTransform="capitalize"
					fontFamily="$heading"
				>
					{data.group}
				</Heading>

				<Text color="$gray100" fontSize={"$lg"} numberOfLines={2}>
					{data.name}
				</Text>
			</VStack>

			<Text color="$gray100" fontSize={"$md"}>
				{data.hour}
			</Text>
		</HStack>
	);
}
