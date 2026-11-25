import { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    ScrollView
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { exibirAlerta } from '../utils/alerta';
import { useSessao } from '../contexts/sessao';

export default function LoginScreen({ abrirCadastro }) {

    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [mostrarSenha, setMostrarSenha] = useState(false);
    const [carregando, setCarregando] = useState(false);

    const { entrar: iniciarSessao } = useSessao();

    async function entrar() {

        if (!email.trim() || !senha) {
            exibirAlerta('Atenção', 'Preencha todos os campos.');
            return;
        }

        try {
            setCarregando(true);

            await iniciarSessao(email.trim(), senha);

        } catch (erro) {
            exibirAlerta(
                'Erro ao entrar',
                erro.response?.data?.mensagem ||
                'Não foi possível realizar o login.'
            );
        } finally {
            setCarregando(false);
        }
    }

    return (
        <LinearGradient
            colors={['#ECFDF5', '#FFFFFF', '#FFFFFF', '#F0FDF4']}
            style={styles.container}
        >
            <ScrollView
                contentContainerStyle={styles.conteudo}
                keyboardShouldPersistTaps="handled"
            >
                <View style={styles.cabecalho}>

                    <View style={styles.logo}>
                        <Ionicons
                            name="wallet"
                            size={32}
                            color="#FFFFFF"
                        />
                    </View>

                    <Text style={styles.titulo}>SpendWise</Text>

                    <Text style={styles.subtitulo}>
                        Controle suas finanças com inteligência
                    </Text>

                </View>

                <View style={styles.formulario}>

                    <Text style={styles.boasVindas}>
                        Bem-vindo de volta!
                    </Text>

                    <Text style={styles.label}>E-MAIL</Text>

                    <View style={styles.campo}>
                        <Ionicons
                            name="mail-outline"
                            size={20}
                            color="#94A3B8"
                        />

                        <TextInput
                            style={styles.input}
                            placeholder="seu@email.com"
                            placeholderTextColor="#B4C0CE"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            autoCorrect={false}
                            value={email}
                            onChangeText={setEmail}
                        />
                    </View>

                    <Text style={styles.label}>SENHA</Text>

                    <View style={styles.campo}>
                        <Ionicons
                            name="lock-closed-outline"
                            size={20}
                            color="#94A3B8"
                        />

                        <TextInput
                            style={styles.input}
                            placeholder="Sua senha"
                            placeholderTextColor="#B4C0CE"
                            secureTextEntry={!mostrarSenha}
                            autoCapitalize="none"
                            value={senha}
                            onChangeText={setSenha}
                        />

                        <TouchableOpacity
                            onPress={() => setMostrarSenha(!mostrarSenha)}
                        >
                            <Ionicons
                                name={mostrarSenha ? 'eye-off-outline' : 'eye-outline'}
                                size={22}
                                color="#94A3B8"
                            />
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                        style={styles.botao}
                        onPress={entrar}
                        disabled={carregando}
                    >
                        {carregando ? (
                            <ActivityIndicator color="#FFFFFF" />
                        ) : (
                            <Text style={styles.textoBotao}>
                                Entrar
                            </Text>
                        )}
                    </TouchableOpacity>

                </View>

                <View style={styles.rodape}>

                    <Text style={styles.textoRodape}>
                        Não tem uma conta?
                    </Text>

                    <TouchableOpacity onPress={abrirCadastro}>
                        <Text style={styles.link}>
                            Cadastre-se
                        </Text>
                    </TouchableOpacity>

                </View>

            </ScrollView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({

    container: {
        flex: 1
    },

    conteudo: {
        flexGrow: 1,
        paddingHorizontal: 28,
        paddingTop: 80,
        paddingBottom: 40
    },

    cabecalho: {
        alignItems: 'center',
        marginBottom: 48
    },

    logo: {
        width: 76,
        height: 76,
        borderRadius: 20,
        backgroundColor: '#059669',
        justifyContent: 'center',
        alignItems: 'center',
        transform: [{ rotate: '10deg' }],
        marginBottom: 24
    },

    titulo: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#1E293B'
    },

    subtitulo: {
        fontSize: 13,
        color: '#64748B',
        marginTop: 8,
        textAlign: 'center'
    },

    formulario: {
        width: '100%'
    },

    boasVindas: {
        fontSize: 21,
        fontWeight: '600',
        color: '#1E293B',
        marginBottom: 32
    },

    label: {
        fontSize: 12,
        fontWeight: '600',
        color: '#94A3B8',
        marginBottom: 8
    },

    campo: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#E2E8F0',
        marginBottom: 26,
        paddingBottom: 10
    },

    input: {
        flex: 1,
        fontSize: 16,
        color: '#1E293B',
        paddingVertical: 8,
        marginHorizontal: 12
    },

    botao: {
        backgroundColor: '#059669',
        borderRadius: 14,
        paddingVertical: 17,
        alignItems: 'center',
        marginTop: 16,
        elevation: 3,
        shadowColor: '#059669',
        shadowOpacity: 0.25,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 }
    },

    textoBotao: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold'
    },

    rodape: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 'auto',
        paddingTop: 48,
        gap: 5
    },

    textoRodape: {
        color: '#64748B',
        fontSize: 14
    },

    link: {
        color: '#059669',
        fontSize: 14,
        fontWeight: 'bold'
    }

});