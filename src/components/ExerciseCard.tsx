import type { ExerciseDTO } from "@/dtos/ExerciseDTO";
import { api } from "@/services/api";
import {
	Heading,
	HStack,
	Icon,
	Image,
	Text,
	VStack,
} from "@gluestack-ui/themed";
import { ChevronRight } from "lucide-react-native";
import { TouchableOpacity, type TouchableOpacityProps } from "react-native";

type Props = TouchableOpacityProps & {
	data: ExerciseDTO;
};

export function ExerciseCard({ data, ...rest }: Props) {
	return (
		<TouchableOpacity {...rest}>
			<HStack
				bg="$gray500"
				alignItems="center"
				p="$2"
				pr={"$4"}
				mb={"$3"}
				rounded="$md"
			>
				<Image
					source={{
						uri: `${api.defaults.baseURL}/exercise/thumb/${data.thumb}`,
					}}
					alt="Imagem do exercicio"
					w="$16"
					h="$16"
					rounded="$md"
					mr="$4"
					resizeMode="cover"
				/>

				<VStack flex={1}>
					<Heading fontSize="$lg" color="$gray200" fontFamily="$heading">
						{data.name}
					</Heading>

					<Text color="$gray200" fontSize="$sm" mt={"$1"} numberOfLines={2}>
						{data.series} séries x de {data.repetitions} repetições
					</Text>
				</VStack>

				<Icon as={ChevronRight} color="$gray300" />
			</HStack>
		</TouchableOpacity>
	);
}
