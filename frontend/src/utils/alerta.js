import { Alert, Platform } from 'react-native';

export function exibirAlerta(titulo, mensagem, acao) {

    if (Platform.OS === 'web') {
        window.alert(`${titulo}\n\n${mensagem}`);

        if (acao) {
            acao();
        }

    } else {
        Alert.alert(
            titulo,
            mensagem,
            [{ text: 'OK', onPress: acao }],
            { cancelable: false }
        );
    }
}