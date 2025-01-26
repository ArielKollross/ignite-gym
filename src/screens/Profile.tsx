import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { ScreenHeader } from "@/components/ScreenHeader";
import { UserPhoto } from "@/components/UserPhoto";
import { Center, Heading, Text, useToast, VStack } from "@gluestack-ui/themed";
import { Alert, ScrollView, TouchableOpacity } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { useState } from "react";
import { ToastMessage } from "@/components/ToastMessage";

export function Profile() {
    const [userPhoto, setUserPhoto] = useState('https://github.com/arielkollross.png');

    const toast = useToast();

    async function handlerUserPhotoSelect() {
        try {
            const photoSelected = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                quality: 1,
                aspect: [4, 4],
                allowsEditing: true,
            });

            if (photoSelected.canceled) return

            const photoUri = photoSelected.assets[0].uri

            if (!photoUri) return

            const photoInfo = await FileSystem.getInfoAsync(photoUri) as {
                size: number
            };

            if (photoInfo.size && (photoInfo.size / 1024 / 1024) > 5) {
                return toast.show({
                    placement: "top",
                    render: ({ id }) => (
                        <ToastMessage
                            id={id}
                            action="error"
                            title="Selecione uma imagem até 5Mb"
                            onClose={() => toast.close(id)}
                        />
                    )
                });
            }

            setUserPhoto(photoUri)
        }
        catch (error) {
            console.error(error)
        }
    }

    return (
        <VStack flex={1}>
            <ScreenHeader title="Perfil" />

            <ScrollView contentContainerStyle={{ paddingBottom: 36 }}>
                <Center mt={"$6"} px={"$10"}>
                    <UserPhoto source={{ uri: userPhoto }} alt="Imagem do Usuário" size="xl" />

                    <TouchableOpacity onPress={handlerUserPhotoSelect}>
                        <Text color="$green500" fontFamily="$heading" fontSize="$md" mt={"$2"} mb={"$8"}>Alterar foto</Text>
                    </TouchableOpacity>

                    <Center w={"$full"} gap={"$4"}>
                        <Input placeholder="Nome" bg="$gray600" />
                        <Input placeholder="Email" bg="$gray600" isReadOnly />
                    </Center>

                    <Heading color="$gray200" fontSize="$md" fontFamily="$heading" mt={"$12"} mb={"$2"}>
                        Alterar senha
                    </Heading>

                    <Center w={"$full"} gap={"$4"}>
                        <Input placeholder="Senha antiga" bg="$gray600" secureTextEntry />
                        <Input placeholder="Senha nova" bg="$gray600" secureTextEntry />
                        <Input placeholder="Confirme a senha" bg="$gray600" secureTextEntry />
                    </Center>

                    <Button title="Atualizar" mt={"$8"} />
                </Center>
            </ScrollView>
        </VStack>
    )
}