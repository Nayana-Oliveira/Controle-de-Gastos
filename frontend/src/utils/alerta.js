import { Alert, Platform } from 'react-native';

export function exibirAlerta(titulo, mensagem, acao) {

    const botoes = Array.isArray(acao)
        ? acao
        : [{ text: 'OK', onPress: acao }];

    if (Platform.OS === 'web') {

        if (botoes.length > 1) {

            const confirmou = window.confirm(
                `${titulo}\n\n${mensagem}`
            );

            if (confirmou) {
                botoes[botoes.length - 1].onPress?.();
            }

        } else {

            window.alert(`${titulo}\n\n${mensagem}`);
            botoes[0].onPress?.();

        }

    } else {

        Alert.alert(titulo, mensagem, botoes, {
            cancelable: false
        });

    }
}