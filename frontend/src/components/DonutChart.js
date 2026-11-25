import { StyleSheet, Text, View } from "react-native";
import Svg, { Circle } from "react-native-svg";
import { formatarMoeda } from "../utils/formatar";

export default function DonutChart({dados, total, tamanho = 190, espessura = 26 }) {
  const centro = tamanho / 2;
  const raio = (tamanho - espessura) / 2;
  const circunferencia = 2 * Math.PI * raio;

  let acumulado = 0;

  return (
    <View style={{ width: tamanho, height: tamanho }}>
      <Svg width={tamanho} height={tamanho} style={styles.girado}>
        <Circle
          cx={centro}
          cy={centro}
          r={raio}
          stroke="#E4E7EB"
          strokeWidth={espessura}
          fill="none"
        />

        {dados.map((item) => {
          const comprimento = (item.valor / total) * circunferencia;
          const deslocamento = -acumulado;
          acumulado += comprimento;

          return (
            <Circle
              key={item.nome}
              cx={centro}
              cy={centro}
              r={raio}
              stroke={item.cor}
              strokeWidth={espessura}
              fill="none"
              strokeDasharray={`${comprimento} ${circunferencia - comprimento}`}
              strokeDashoffset={deslocamento}
            />
          );
        })}
      </Svg>

      <View style={styles.centro} pointerEvents="none">
        <Text style={styles.rotulo}>TOTAL DO MÊS</Text>
        <Text style={styles.valor} numberOfLines={1} adjustsFontSizeToFit>
          {formatarMoeda(total)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  girado: {
    transform: [{ rotate: "-90deg" }],
  },
  centro: {
    ...StyleSheet.absoluteFill,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
  },
  rotulo: {
    fontSize: 9,
    color: "#7B8794",
    letterSpacing: 1,
  },
  valor: {
    fontSize: 20,
    fontWeight: "800",
    color: "#1F2933",
    marginTop: 2,
  },
});
