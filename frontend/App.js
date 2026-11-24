import { useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';

import LoginScreen from './src/screens/LoginScreen';
import CadastroScreen from './src/screens/CadastroScreen';
import HomeScreen from './src/screens/HomeScreen';

import { SessaoProvider, useSessao } from './src/contexts/sessao';

function Telas() {

    const [tela, setTela] = useState('login');

    const { usuario, carregando } = useSessao();

    if (carregando) {
        return (
            <View style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <ActivityIndicator
                    size="large"
                    color="#059669"
                />
            </View>
        );
    }

    return (
        <>
            <StatusBar style="dark" />

            {usuario ? (
                <HomeScreen />
            ) : tela === 'cadastro' ? (
                <CadastroScreen
                    abrirLogin={() => setTela('login')}
                />
            ) : (
                <LoginScreen
                    abrirCadastro={() => setTela('cadastro')}
                />
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