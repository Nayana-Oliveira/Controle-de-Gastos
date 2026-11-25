
import { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Alert,
    ActivityIndicator,
    ScrollView,
    Platform
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { exibirAlerta } from '../utils/alerta';
import { cadastrarUsuario } from '../services/autenticacaoService';

export default function CadastroScreen({ abrirLogin }) {

    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [mostrarSenha, setMostrarSenha] = useState(false);
    const [carregando, setCarregando] = useState(false);

    async function cadastrar() {

        if (!nome.trim() || !email.trim() || !senha) {
            exibirAlerta('Atenção', 'Preencha todos os campos.');
            return;
        }

        if (senha.length < 8) {
            exibirAlerta('Atenção', 'A senha deve ter pelo menos 8 caracteres.');
            return;
        }

        try {
            setCarregando(true);

            await cadastrarUsuario(nome.trim(), email.trim(), senha);

            exibirAlerta(
                'Sucesso',
                'Conta criada com sucesso!',
                abrirLogin
            );

        } catch (erro) {
            exibirAlerta(
                'Erro',
                erro.response?.data?.mensagem ||
                'Não foi possível criar a conta.'
            );

        } finally {
            setCarregando(false);
        }
    }
    return (
        <LinearGradient
            colors={['#F0FDF4', '#FFFFFF', '#FFFFFF', '#ECFDF5']}
            style={styles.container}
        >
            <ScrollView
                contentContainerStyle={styles.conteudo}
                keyboardShouldPersistTaps="handled"
            >
                <View style={styles.cabecalho}>

                    <TouchableOpacity
                        style={styles.botaoVoltar}
                        onPress={abrirLogin}
                    >
                        <Ionicons
                            name="chevron-back"
                            size={24}
                            color="#475569"
                        />
                    </TouchableOpacity>

                    <View style={styles.logo}>
                        <Ionicons
                            name="wallet"
                            size={25}
                            color="#FFFFFF"
                        />
                    </View>

                </View>

                <Text style={styles.titulo}>
                    Crie sua conta
                </Text>

                <Text style={styles.subtitulo}>
                    Comece a transformar sua relação com o dinheiro hoje mesmo.
                </Text>

                <View style={styles.formulario}>

                    <Text style={styles.label}>
                        NOME COMPLETO
                    </Text>

                    <View style={styles.campo}>
                        <Ionicons
                            name="person-outline"
                            size={20}
                            color="#94A3B8"
                        />

                        <TextInput
                            style={styles.input}
                            placeholder="Seu nome"
                            placeholderTextColor="#B4C0CE"
                            autoCapitalize="words"
                            value={nome}
                            onChangeText={setNome}
                        />
                    </View>

                    <Text style={styles.label}>
                        E-MAIL
                    </Text>

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

                    <Text style={styles.label}>
                        SENHA
                    </Text>

                    <View style={styles.campo}>
                        <Ionicons
                            name="lock-closed-outline"
                            size={20}
                            color="#94A3B8"
                        />

                        <TextInput
                            style={styles.input}
                            placeholder="Mínimo 8 caracteres"
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
                        onPress={cadastrar}
                        disabled={carregando}
                    >
                        {carregando ? (
                            <ActivityIndicator color="#FFFFFF" />
                        ) : (
                            <Text style={styles.textoBotao}>
                                Criar conta
                            </Text>
                        )}
                    </TouchableOpacity>

                </View>

                <View style={styles.rodape}>

                    <Text style={styles.textoRodape}>
                        Já tem uma conta?
                    </Text>

                    <TouchableOpacity onPress={abrirLogin}>
                        <Text style={styles.link}>
                            Login
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
        paddingTop: 60,
        paddingBottom: 40
    },

    cabecalho: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 36
    },

    botaoVoltar: {
        position: 'absolute',
        left: 0,
        backgroundColor: '#F1F5F9',
        padding: 8,
        borderRadius: 10
    },

    logo: {
        width: 52,
        height: 52,
        borderRadius: 14,
        backgroundColor: '#059669',
        justifyContent: 'center',
        alignItems: 'center'
    },

    titulo: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#1E293B'
    },

    subtitulo: {
        fontSize: 15,
        color: '#64748B',
        lineHeight: 22,
        marginTop: 10,
        marginBottom: 36
    },

    formulario: {
        width: '100%'
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
        marginTop: 36,
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
