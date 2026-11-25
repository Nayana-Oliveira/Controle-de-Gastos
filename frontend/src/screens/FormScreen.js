import { useState } from 'react';
import {
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';
import { CATEGORIAS, ICONES } from '../constants/categorias';
import { atualizarDespesa, criarDespesa } from '../services/despesaService';
import { formatarData } from '../utils/formatar';

// ---------- Funções auxiliares (valor, data e erro) ----------

// 123456 (centavos) -> "1.234,56"
function formatarCentavos(centavos) {
    const reais = Math.floor(centavos / 100);
    const resto = String(centavos % 100).padStart(2, '0');
    return `${String(reais).replace(/\B(?=(\d{3})+(?!\d))/g, '.')},${resto}`;
}

// Vai colocando as barras enquanto a pessoa digita: "1011" -> "10/11"
function mascararData(texto) {
    const d = texto.replace(/\D/g, '').slice(0, 8);
    if (d.length <= 2) return d;
    if (d.length <= 4) return `${d.slice(0, 2)}/${d.slice(2)}`;
    return `${d.slice(0, 2)}/${d.slice(2, 4)}/${d.slice(4)}`;
}

function dateParaTexto(data) {
    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    return `${dia}/${mes}/${data.getFullYear()}`;
}

function hojeTexto() {
    return dateParaTexto(new Date());
}

function ontemTexto() {
    const ontem = new Date();
    ontem.setDate(ontem.getDate() - 1);
    return dateParaTexto(ontem);
}

// "10/11/2026" -> "2026-11-10" (formato que o backend espera). Devolve null se a data não existir.
function textoParaISO(texto) {
    const partes = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(texto);
    if (!partes) return null;

    const dia = Number(partes[1]);
    const mes = Number(partes[2]);
    const ano = Number(partes[3]);

    const data = new Date(ano, mes - 1, dia);
    const existe = data.getFullYear() === ano && data.getMonth() === mes - 1 && data.getDate() === dia;

    return existe ? `${partes[3]}-${partes[2]}-${partes[1]}` : null;
}

// O backend responde { timestamp, status, erro, mensagem, caminho }
function mensagemDeErro(erro, padrao) {
    if (erro?.response?.data?.mensagem) return erro.response.data.mensagem;
    if (erro?.request && !erro?.response) {
        return 'Sem conexão com o servidor. Confira a internet e o endereço da API.';
    }
    return padrao;
}

// ---------- Cores (as mesmas da Home e do DespesaItem) ----------

const COR_DESPESA = '#E5484D';
const COR_RECEITA = '#0F9D6B';
const COR_PRIMARIA = '#0F9D6B';
const COR_FUNDO_ATIVO = '#EAF7F1';
const COR_TEXTO = '#1F2933';
const COR_CINZA = '#7B8794';
const COR_BORDA = '#E4E7EB';

// ---------- Tela ----------

// Cadastro e edição na mesma tela.
//   despesa  -> null para uma nova, ou o objeto da despesa para editar
//   aoFechar -> chamado ao tocar no X (sem salvar)
//   aoSalvar -> chamado depois de salvar com sucesso (a Home recarrega a lista)
export default function FormScreen({ despesa, aoFechar, aoSalvar }) {
    const editando = despesa != null;

    const [centavos, setCentavos] = useState(editando ? Math.round(despesa.valor * 100) : 0);
    const [categoria, setCategoria] = useState(editando ? despesa.categoria : null);
    const [descricao, setDescricao] = useState(editando ? despesa.descricao : '');
    const [dataTexto, setDataTexto] = useState(editando ? formatarData(despesa.data) : hojeTexto());
    const [tipo, setTipo] = useState(editando ? despesa.tipo : 'DESPESA');

    const [salvando, setSalvando] = useState(false);
    const [erro, setErro] = useState(null);

    // Se a despesa tem uma categoria que não está na lista, ela aparece junto para não se perder
    const categorias =
        editando && !CATEGORIAS.includes(despesa.categoria) ? [...CATEGORIAS, despesa.categoria] : CATEGORIAS;

    const ehReceita = tipo === 'RECEITA';
    const corTema = ehReceita ? COR_RECEITA : COR_DESPESA;
    const nomeTipo = ehReceita ? 'Receita' : 'Despesa';

    function aoDigitarValor(texto) {
        const digitos = texto.replace(/\D/g, '');
        // até 8 dígitos antes da vírgula, igual ao limite do backend
        setCentavos(Math.min(Number(digitos || '0'), 9999999999));
    }

    async function salvar() {
        if (salvando) return;

        const dataISO = textoParaISO(dataTexto);

        if (centavos <= 0) return setErro('Informe um valor maior que zero.');
        if (!categoria) return setErro('Escolha uma categoria.');
        if (!descricao.trim()) return setErro('Preencha a descrição.');
        if (!dataISO) return setErro('Data inválida. Use o formato DD/MM/AAAA.');

        setErro(null);
        setSalvando(true);

        const corpo = {
            descricao: descricao.trim(),
            valor: centavos / 100,
            tipo,
            categoria,
            data: dataISO,
        };

        try {
            if (editando) {
                await atualizarDespesa(despesa.id, corpo);
            } else {
                await criarDespesa(corpo);
            }
            aoSalvar();
        } catch (e) {
            setErro(mensagemDeErro(e, 'Não foi possível salvar. Tente novamente.'));
            setSalvando(false);
        }
    }

    return (
        <KeyboardAvoidingView
            style={[styles.tela, { backgroundColor: corTema }]}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <StatusBar barStyle="light-content" />

            {/* Cabeçalho colorido com o valor */}
            <View style={styles.cabecalho}>
                <View style={styles.cabecalhoTopo}>
                    <Pressable style={styles.botaoFechar} onPress={aoFechar} hitSlop={12}>
                        <Text style={styles.botaoFecharTexto}>✕</Text>
                    </Pressable>
                    <Text style={styles.titulo}>{editando ? `Editar ${nomeTipo}` : `Nova ${nomeTipo}`}</Text>
                    <View style={styles.botaoFechar} />
                </View>

                <Text style={styles.rotuloValor}>{ehReceita ? 'VALOR DA RECEITA' : 'VALOR DO GASTO'}</Text>
                <View style={styles.linhaValor}>
                    <Text style={styles.moeda}>R$</Text>
                    <TextInput
                        style={styles.valor}
                        value={formatarCentavos(centavos)}
                        onChangeText={aoDigitarValor}
                        keyboardType="number-pad"
                        autoFocus={!editando}
                        selectionColor="#FFFFFF"
                        maxLength={14}
                    />
                </View>
            </View>

            {/* Cartão branco com o formulário */}
            <View style={styles.cartao}>
                <ScrollView
                    keyboardShouldPersistTaps="handled"
                    contentContainerStyle={styles.conteudo}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.tipos}>
                        {['DESPESA', 'RECEITA'].map((opcao) => {
                            const ativo = tipo === opcao;
                            return (
                                <Pressable
                                    key={opcao}
                                    style={[styles.tipo, ativo && styles.tipoAtivo]}
                                    onPress={() => setTipo(opcao)}
                                >
                                    <Text style={[styles.tipoTexto, ativo && styles.tipoTextoAtivo]}>
                                        {opcao === 'DESPESA' ? 'Despesa' : 'Receita'}
                                    </Text>
                                </Pressable>
                            );
                        })}
                    </View>

                    <Text style={styles.rotulo}>CATEGORIA</Text>
                    <View style={styles.categorias}>
                        {categorias.map((nome) => {
                            const selecionada = categoria === nome;
                            return (
                                <Pressable key={nome} style={styles.categoriaItem} onPress={() => setCategoria(nome)}>
                                    <View style={[styles.categoriaCaixa, selecionada && styles.categoriaCaixaAtiva]}>
                                        <Text style={styles.categoriaEmoji}>{ICONES[nome] || '📦'}</Text>
                                    </View>
                                    <Text
                                        style={[styles.categoriaNome, selecionada && styles.categoriaNomeAtivo]}
                                        numberOfLines={1}
                                    >
                                        {nome}
                                    </Text>
                                </Pressable>
                            );
                        })}
                    </View>

                    <Text style={styles.rotulo}>DESCRIÇÃO</Text>
                    <View style={styles.campo}>
                        <Text style={styles.campoIcone}>✏️</Text>
                        <TextInput
                            style={styles.campoTexto}
                            placeholder={ehReceita ? 'De onde veio?' : 'Onde você gastou?'}
                            placeholderTextColor="#B5BBC6"
                            value={descricao}
                            onChangeText={setDescricao}
                            maxLength={255}
                            returnKeyType="done"
                        />
                    </View>

                    <Text style={styles.rotulo}>DATA</Text>
                    <View style={styles.linhaData}>
                        <View style={[styles.campo, styles.campoData]}>
                            <Text style={styles.campoIcone}>📅</Text>
                            <TextInput
                                style={styles.campoTexto}
                                placeholder="DD/MM/AAAA"
                                placeholderTextColor="#B5BBC6"
                                value={dataTexto}
                                onChangeText={(texto) => setDataTexto(mascararData(texto))}
                                keyboardType="number-pad"
                                maxLength={10}
                            />
                        </View>

                        <Pressable
                            style={[styles.atalhoData, dataTexto === hojeTexto() && styles.atalhoDataAtivo]}
                            onPress={() => setDataTexto(hojeTexto())}
                        >
                            <Text
                                style={[styles.atalhoDataTexto, dataTexto === hojeTexto() && styles.atalhoDataTextoAtivo]}
                            >
                                Hoje
                            </Text>
                        </Pressable>

                        <Pressable
                            style={[styles.atalhoData, dataTexto === ontemTexto() && styles.atalhoDataAtivo]}
                            onPress={() => setDataTexto(ontemTexto())}
                        >
                            <Text
                                style={[styles.atalhoDataTexto, dataTexto === ontemTexto() && styles.atalhoDataTextoAtivo]}
                            >
                                Ontem
                            </Text>
                        </Pressable>
                    </View>
                </ScrollView>

                {/* Rodapé fixo com o erro e o botão */}
                <View style={styles.rodape}>
                    {erro ? <Text style={styles.erro}>{erro}</Text> : null}

                    <Pressable
                        style={[styles.botaoSalvar, salvando && styles.botaoSalvarDesativado]}
                        onPress={salvar}
                        disabled={salvando}
                    >
                        {salvando ? (
                            <ActivityIndicator color="#FFFFFF" />
                        ) : (
                            <Text style={styles.botaoSalvarTexto}>
                                {editando ? 'Salvar alterações' : `Salvar ${nomeTipo}`}
                            </Text>
                        )}
                    </Pressable>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    tela: { flex: 1 },

    // Cabeçalho
    cabecalho: {
        paddingTop: 56, // espaço da barra de status
        paddingHorizontal: 24,
        paddingBottom: 28,
    },
    cabecalhoTopo: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    botaoFechar: {
        width: 34,
        height: 34,
        borderRadius: 17,
        backgroundColor: 'rgba(255,255,255,0.25)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    botaoFecharTexto: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
    titulo: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
    rotuloValor: {
        color: 'rgba(255,255,255,0.85)',
        fontSize: 12,
        fontWeight: '700',
        letterSpacing: 1,
        textAlign: 'center',
    },
    linhaValor: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 6,
    },
    moeda: { color: 'rgba(255,255,255,0.75)', fontSize: 28, fontWeight: '700', marginRight: 10 },
    valor: { color: '#FFFFFF', fontSize: 44, fontWeight: '800', minWidth: 120, padding: 0 },

    // Cartão branco
    cartao: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        overflow: 'hidden',
    },
    conteudo: { paddingHorizontal: 24, paddingTop: 24, paddingBottom: 16 },
    rotulo: {
        color: COR_CINZA,
        fontSize: 12,
        fontWeight: '700',
        letterSpacing: 0.8,
        marginBottom: 12,
        marginTop: 4,
    },

    // Despesa / Receita
    tipos: {
        flexDirection: 'row',
        backgroundColor: '#F4F6F8',
        borderRadius: 14,
        padding: 4,
        marginBottom: 22,
    },
    tipo: { flex: 1, alignItems: 'center', paddingVertical: 10, borderRadius: 11 },
    tipoAtivo: { backgroundColor: '#FFFFFF', elevation: 2 },
    tipoTexto: { fontSize: 14, fontWeight: '600', color: COR_CINZA },
    tipoTextoAtivo: { color: COR_TEXTO },

    // Categorias
    categorias: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 12 },
    categoriaItem: { width: '33.33%', alignItems: 'center', marginBottom: 14 },
    categoriaCaixa: {
        width: 56,
        height: 56,
        borderRadius: 18,
        borderWidth: 1.5,
        borderColor: COR_BORDA,
        backgroundColor: '#FFFFFF',
        alignItems: 'center',
        justifyContent: 'center',
    },
    categoriaCaixaAtiva: { borderColor: COR_PRIMARIA, backgroundColor: COR_FUNDO_ATIVO },
    categoriaEmoji: { fontSize: 24 },
    categoriaNome: { marginTop: 6, fontSize: 12, color: COR_CINZA, fontWeight: '600' },
    categoriaNomeAtivo: { color: COR_PRIMARIA },

    // Campos
    campo: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: COR_BORDA,
        paddingVertical: 10,
        marginBottom: 22,
    },
    campoIcone: { fontSize: 16 },
    campoTexto: { flex: 1, marginLeft: 10, fontSize: 16, color: COR_TEXTO, padding: 0 },
    linhaData: { flexDirection: 'row', alignItems: 'center' },
    campoData: { flex: 1, marginRight: 12 },
    atalhoData: {
        paddingHorizontal: 12,
        paddingVertical: 7,
        borderRadius: 14,
        borderWidth: 1.5,
        borderColor: COR_BORDA,
        marginLeft: 6,
        marginBottom: 22,
    },
    atalhoDataAtivo: { borderColor: COR_PRIMARIA, backgroundColor: COR_FUNDO_ATIVO },
    atalhoDataTexto: { fontSize: 13, fontWeight: '600', color: COR_CINZA },
    atalhoDataTextoAtivo: { color: COR_PRIMARIA },

    // Rodapé
    rodape: {
        paddingHorizontal: 24,
        paddingTop: 12,
        paddingBottom: 28,
        borderTopWidth: 1,
        borderTopColor: '#F1F3F7',
        backgroundColor: '#FFFFFF',
    },
    erro: { color: COR_DESPESA, fontSize: 13, marginBottom: 10, textAlign: 'center' },
    botaoSalvar: {
        height: 54,
        borderRadius: 18,
        backgroundColor: COR_PRIMARIA,
        alignItems: 'center',
        justifyContent: 'center',
    },
    botaoSalvarDesativado: { opacity: 0.7 },
    botaoSalvarTexto: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
});
