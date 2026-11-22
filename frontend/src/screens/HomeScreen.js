import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Pressable,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import DespesaItem from '../components/DespesaItem';
import { CATEGORIAS } from '../constants/categorias';
import { excluirDespesa, listarDespesas } from '../services/despesaService';
import { formatarMoeda } from '../utils/formatar';

export default function HomeScreen() {
    const [despesas, setDespesas] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [categoriaSelecionada, setCategoriaSelecionada] = useState('Todas');

    const nomeUsuario = 'Usuário';

    useEffect(() => {
        carregarDespesas();
    }, []);

    async function carregarDespesas() {
        try {
            setCarregando(true);
            const lista = await listarDespesas();
            setDespesas(lista);
        } catch (erro) {
            Alert.alert('Erro', 'Não foi possível carregar as despesas.');
        } finally {
            setCarregando(false);
        }
    }

    function confirmarExclusao(despesa) {
        Alert.alert('Excluir', `Deseja excluir "${despesa.descricao}"?`, [
            { text: 'Cancelar', style: 'cancel' },
            { text: 'Excluir', style: 'destructive', onPress: () => excluir(despesa.id) },
        ]);
    }

    async function excluir(id) {
        try {
            await excluirDespesa(id);
            setDespesas((atual) => atual.filter((d) => d.id !== id));
        } catch (erro) {
            Alert.alert('Erro', 'Não foi possível excluir.');
        }
    }

    function abrirFormulario(despesa) {
        // TODO: navegar para a tela do Formulário (Guilherme) quando ela existir
        Alert.alert('Formulário', despesa ? `Editar: ${despesa.descricao}` : 'Nova transação');
    }

    const totalReceitas = despesas
        .filter((d) => d.tipo === 'RECEITA')
        .reduce((soma, d) => soma + d.valor, 0);

    const totalDespesas = despesas
        .filter((d) => d.tipo === 'DESPESA')
        .reduce((soma, d) => soma + d.valor, 0);

    const saldo = totalReceitas - totalDespesas;

    const listaFiltrada =
        categoriaSelecionada === 'Todas'
            ? despesas
            : despesas.filter((d) => d.categoria === categoriaSelecionada);

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />

            <View style={styles.header}>
                <Text style={styles.saudacao}>Olá, {nomeUsuario}</Text>
                <Text style={styles.saldoRotulo}>Saldo Total</Text>
                <Text style={styles.saldo}>{formatarMoeda(saldo)}</Text>

                <View style={styles.resumo}>
                    <View style={styles.pilula}>
                        <Text style={styles.pilulaTexto}>+ {formatarMoeda(totalReceitas)}</Text>
                    </View>
                    <View style={styles.pilula}>
                        <Text style={styles.pilulaTexto}>- {formatarMoeda(totalDespesas)}</Text>
                    </View>
                </View>
            </View>

            <View style={styles.filtros}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {['Todas', ...CATEGORIAS].map((categoria) => {
                        const ativa = categoria === categoriaSelecionada;
                        return (
                            <Pressable
                                key={categoria}
                                style={[styles.chip, ativa && styles.chipAtivo]}
                                onPress={() => setCategoriaSelecionada(categoria)}
                            >
                                <Text style={[styles.chipTexto, ativa && styles.chipTextoAtivo]}>{categoria}</Text>
                            </Pressable>
                        );
                    })}
                </ScrollView>
            </View>

            <Text style={styles.titulo}>Transações Recentes</Text>

            {carregando ? (
                <ActivityIndicator size="large" color="#0F9D6B" style={styles.carregando} />
            ) : (
                <FlatList
                    data={listaFiltrada}
                    keyExtractor={(item) => String(item.id)}
                    renderItem={({ item }) => (
                        <DespesaItem despesa={item} onPress={abrirFormulario} onExcluir={confirmarExclusao} />
                    )}
                    ListEmptyComponent={<Text style={styles.vazio}>Nenhuma transação encontrada.</Text>}
                    contentContainerStyle={styles.lista}
                />
            )}

            <Pressable style={styles.botaoAdicionar} onPress={() => abrirFormulario(null)}>
                <Text style={styles.botaoAdicionarTexto}>+</Text>
            </Pressable>
        </View>
    );
}


const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F4F6F8' },
    header: {
        backgroundColor: '#0F9D6B',
        paddingTop: 56, // espaço da barra de status
        paddingBottom: 24,
        paddingHorizontal: 20,
        borderBottomLeftRadius: 28,
        borderBottomRightRadius: 28,
        alignItems: 'center',
    },
    saudacao: { alignSelf: 'flex-start', color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
    saldoRotulo: { color: '#D5F2E6', fontSize: 13, marginTop: 16 },
    saldo: { color: '#FFFFFF', fontSize: 34, fontWeight: '800', marginTop: 4 },
    resumo: { flexDirection: 'row', marginTop: 14 },
    pilula: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 20,
        paddingVertical: 6,
        paddingHorizontal: 14,
        marginHorizontal: 5,
    },
    pilulaTexto: { color: '#FFFFFF', fontSize: 13, fontWeight: '600' },
    filtros: { paddingLeft: 20, marginTop: 16 },
    chip: {
        backgroundColor: '#FFFFFF',
        borderRadius: 20,
        paddingVertical: 8,
        paddingHorizontal: 16,
        marginRight: 8,
    },
    chipAtivo: { backgroundColor: '#0F9D6B' },
    chipTexto: { color: '#52606D', fontWeight: '600' },
    chipTextoAtivo: { color: '#FFFFFF' },
    titulo: { fontSize: 18, fontWeight: '700', color: '#1F2933', marginHorizontal: 20, marginTop: 20, marginBottom: 10 },
    lista: { paddingHorizontal: 20, paddingBottom: 100 },
    carregando: { marginTop: 40 },
    vazio: { textAlign: 'center', color: '#7B8794', marginTop: 30 },
    botaoAdicionar: {
        position: 'absolute',
        right: 24,
        bottom: 30,
        width: 58,
        height: 58,
        borderRadius: 29,
        backgroundColor: '#0F9D6B',
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 6,
    },
    botaoAdicionarTexto: { color: '#FFFFFF', fontSize: 30, lineHeight: 32 },
});