import { useState } from "react";
import { View, ActivityIndicator, Pressable, Text, StyleSheet } from "react-native";
import { StatusBar } from "expo-status-bar";

import LoginScreen from "./src/screens/LoginScreen";
import CadastroScreen from "./src/screens/CadastroScreen";
import HomeScreen from "./src/screens/HomeScreen";
import ResumoScreen from "./src/screens/ResumoScreen";
import FormScreen from "./src/screens/FormScreen";

import { SessaoProvider, useSessao } from "./src/contexts/sessao";

function Telas() {
  const [tela, setTela] = useState("login");
  const [aba, setAba] = useState("home");
  const [formulario, setFormulario] = useState(null);

  const { usuario, carregando } = useSessao();

  if (carregando) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" color="#059669" />
      </View>
    );
  }

  return (
    <>
      <StatusBar style="dark" />

      {usuario && formulario ? (
        <FormScreen
          despesa={formulario.despesa}
          aoFechar={() => setFormulario(null)}
          aoSalvar={() => setFormulario(null)}
        />
      ) : usuario ? (
        <View style={{ flex: 1 }}>
          <View style={{ flex: 1 }}>
            {aba === "home" ? (
              <HomeScreen abrirFormulario={(despesa) => setFormulario({ despesa })} />
            ) : (
              <ResumoScreen />
            )}
          </View>

          <View style={estilos.barra}>
            <Pressable style={estilos.aba} onPress={() => setAba("home")}>
              <Text
                style={[estilos.abaTexto, aba === "home" && estilos.abaAtiva]}
              >
                🏠 Home
              </Text>
            </Pressable>

            <Pressable style={estilos.aba} onPress={() => setAba("resumo")}>
              <Text
                style={[estilos.abaTexto, aba === "resumo" && estilos.abaAtiva]}
              >
                📊 Resumo
              </Text>
            </Pressable>
          </View>
        </View>
      ) : tela === "cadastro" ? (
        <CadastroScreen abrirLogin={() => setTela("login")} />
      ) : (
        <LoginScreen abrirCadastro={() => setTela("cadastro")} />
      )}
    </>
  );
}

export default function App() {
  return (
    <SessaoProvider>
      <Telas />
    </SessaoProvider>
  );
}

const estilos = StyleSheet.create({
  barra: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    paddingTop: 10,
    paddingBottom: 24,
    borderTopWidth: 1,
    borderTopColor: "#E4E7EB",
  },
  aba: {
    flex: 1,
    alignItems: "center",
  },
  abaTexto: {
    fontSize: 14,
    fontWeight: "600",
    color: "#7B8794",
  },
  abaAtiva: {
    color: "#0F9D6B",
  },
});