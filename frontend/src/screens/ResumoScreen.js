import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import DonutChart from '../components/DonutChart';
import { COR_PADRAO, CORES, ICONES } from '../constants/categorias';
import { obterResumo } from '../services/resumoService';
import { formatarMoeda } from '../utils/formatar';

const MESES = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

export default function ResumoScreen() {
    const [resumo, setResumo] = useState(null);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState(false);

    //pega o nome do authContext quando ele existir
    const nomeUsuario = 'Usuário';

    useEffect(() => {
        carregarResumo();
    }, []);

    async function carregarResumo() {
        try {
            setErro(false);
            setCarregando(true);
            setResumo(await obterResumo());
        } catch(e) {
            setErro(true);
        } finally{
            setCarregando(false);
        }
    }

    function confirmarSaida() {
        Alert.alert('Sair da conta', 'Deseja realmente sair?', [
            {text: 'Cancelar', style: 'cancel'},
            {text: 'Sair', style: 'destructive', onPress: sair}
        ]);
    }

    function sair() {
        //preciso que o gabriel faça a parte dele
        Alert.alert('Sair', 'O logout ainda não está conectado ao AuthContext')
    }

    const categorias = (resumo?.categorias ?? []).map((c) => ({
        nome: c.categoria,
        valor: c.total,
        percentual: Math.round(c.percentual),
        cor: CORES[c.categoria] || COR_PADRAO
    }));

    const total = resumo?.totalGasto ?? 0;

       return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />

            <ScrollView contentContainerStyle={styles.conteudo}>
                <Text style={styles.titulo}>Seu Resumo</Text>

                <View style={styles.cartaoPerfil}>
                    <View style={styles.avatar}>
                        <Text style={styles.avatarTexto}>{nomeUsuario.charAt(0).toUpperCase()}</Text>
                    </View>
                    <View>
                        <Text style={styles.nome}>{nomeUsuario}</Text>
                    </View>
                </View>

                <View style={styles.cartao}>
                    <View style={styles.cabecalhoCartao}>
                        <Text style={styles.subtitulo}>Gasto por Categoria</Text>
                        {resumo && <Text style={styles.selo}>{MESES[resumo.mes - 1]}</Text>}
                    </View>

                    {carregando && <ActivityIndicator size="large" color="#0F9D6B" style={styles.carregando} />}

                    {!carregando && erro && (
                        <View style={styles.centralizado}>
                            <Text style={styles.mensagem}>Não foi possível carregar o resumo.</Text>
                            <Pressable onPress={carregarResumo}>
                                <Text style={styles.tentarDeNovo}>Tentar novamente</Text>
                            </Pressable>
                        </View>
                    )}

                    {!carregando && !erro && categorias.length === 0 && (
                        <Text style={styles.mensagem}>Nenhuma despesa neste mês.</Text>
                    )}

                    {!carregando && !erro && categorias.length > 0 && (
                        <>
                            <View style={styles.centralizado}>
                                <DonutChart dados={categorias} total={total} />
                            </View>

                            <View style={styles.lista}>
                                {categorias.map((c) => (
                                    <View key={c.nome} style={styles.linhaCategoria}>
                                        <View style={[styles.bolinha, { backgroundColor: c.cor }]} />
                                        <Text style={styles.categoriaNome}>
                                            {ICONES[c.nome] || '📦'} {c.nome}
                                        </Text>
                                        <View style={styles.categoriaValores}>
                                            <Text style={styles.categoriaValor}>{formatarMoeda(c.valor)}</Text>
                                            <Text style={styles.categoriaPercentual}>{c.percentual}%</Text>
                                        </View>
                                    </View>
                                ))}
                            </View>
                        </>
                    )}
                </View>

                <Pressable style={styles.botaoSair} onPress={confirmarSaida}>
                    <Text style={styles.botaoSairTexto}>🚪  Sair da Conta</Text>
                </Pressable>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        backgroundColor: '#F4F6F8' 
    },
    conteudo: { 
        paddingTop: 56, 
        paddingHorizontal: 20, 
        paddingBottom: 40 
    },
    titulo: { 
        fontSize: 18, 
        fontWeight: '700', 
        color: '#1F2933', 
        textAlign: 'center', 
        marginBottom: 18 
    },
    cartaoPerfil: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#0F9D6B',
        borderRadius: 22,
        padding: 16,
        marginBottom: 16,
    },
    avatar: {
        width: 52,
        height: 52,
        borderRadius: 26,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 14,
    },
    avatarTexto: { 
        fontSize: 22, 
        fontWeight: '800', 
        color: '#0F9D6B' 
    },
    nome: { 
        color: '#FFFFFF', 
        fontSize: 17, 
        fontWeight: '700' 
    },
    plano: { 
        color: '#D5F2E6', 
        fontSize: 12, 
        marginTop: 2 
    },
    cartao: { 
        backgroundColor: '#FFFFFF', 
        borderRadius: 22, 
        padding: 18, 
        marginBottom: 20 
    },
    cabecalhoCartao: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    subtitulo: { 
        fontSize: 15, 
        fontWeight: '700', 
        color: '#1F2933' 
    },
    selo: {
        fontSize: 10,
        fontWeight: '700',
        color: '#52606D',
        backgroundColor: '#EEF2F7',
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 8,
    },
    centralizado: { 
        alignItems: 'center' 
    },
    carregando: { 
        marginVertical: 40 
    },
    mensagem: { 
        textAlign: 'center', 
        color: '#7B8794', 
        marginVertical: 30 
    },
    tentarDeNovo: { 
        color: '#0F9D6B', 
        fontWeight: '700', 
        marginBottom: 10 
    },
    lista: { 
        marginTop: 22 
    },
    linhaCategoria: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        paddingVertical: 8 
    },
    bolinha: { 
        width: 10, 
        height: 10, 
        borderRadius: 5, 
        marginRight: 10 
    },
    categoriaNome: { 
        flex: 1, 
        fontSize: 14, 
        color: '#1F2933' 
    },
    categoriaValores: { 
        alignItems: 'flex-end' 
    },
    categoriaValor: { 
        fontSize: 14, 
        fontWeight: '700', 
        color: '#1F2933' 
    },
    categoriaPercentual: { 
        fontSize: 11, 
        color: '#7B8794', 
        marginTop: 1 
    },
    botaoSair: {
        backgroundColor: '#FFF1F2',
        borderRadius: 16,
        padding: 16,
        alignItems: 'center',
    },
    botaoSairTexto: { 
        color: '#E5484D', 
        fontSize: 15, 
        fontWeight: '700' 
    },
});