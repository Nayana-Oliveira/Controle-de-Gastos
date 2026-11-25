import { Pressable, StyleSheet, Text, View } from 'react-native';
import { ICONES } from '../constants/categorias';
import { formatarData, formatarMoeda } from '../utils/formatar';

export default function DespesaItem({ despesa, onPress, onExcluir }) {
    const ehReceita = despesa.tipo === 'RECEITA';

    return (
        <Pressable style={styles.card} onPress={() => onPress(despesa)}>
            <View style={styles.icone}>
                <Text style={styles.emoji}>{ICONES[despesa.categoria] || '📦'}</Text>
            </View>

            <View style={styles.info}>
                <Text style={styles.descricao}>{despesa.descricao}</Text>
                <Text style={styles.detalhe}>
                    {formatarData(despesa.data)} • {despesa.categoria}
                </Text>
            </View>

            <View style={styles.direita}>
                <Text style={[styles.valor, ehReceita ? styles.receita : styles.despesa]}>
                    {ehReceita ? '+ ' : '- '}
                    {formatarMoeda(despesa.valor)}
                </Text>
                <Pressable onPress={() => onExcluir(despesa)} hitSlop={8}>
                    <Text style={styles.excluir}>Excluir</Text>
                </Pressable>
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 14,
        padding: 14,
        marginBottom: 10,
    },

    icone: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: '#EAF7F1',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },

    emoji: {
        fontSize: 22
    },

    info: {
        flex: 1
    },

    descricao: {
        fontSize: 15,
        fontWeight: '600',
        color: '#1F2933'
    },

    detalhe: {
        fontSize: 12,
        color: '#7B8794',
        marginTop: 2
    },

    direita: {
        alignItems: 'flex-end'
    },

    valor: {
        fontSize: 15,
        fontWeight: '700'
    },

    receita: {
        color: '#0F9D6B'
    },

    despesa: {
        color: '#E5484D'
    },

    excluir: {
        fontSize: 12,
        color: '#7B8794',
        marginTop: 6
    },
});