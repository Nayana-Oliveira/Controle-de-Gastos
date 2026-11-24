import { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fazerLogin } from '../services/autenticacaoService';

const SessaoContext = createContext(null);

export function SessaoProvider({ children }) {

    const [usuario, setUsuario] = useState(null);
    const [token, setToken] = useState(null);
    const [carregando, setCarregando] = useState(true);

    useEffect(() => {
        recuperarSessao();
    }, []);

    async function recuperarSessao() {
        try {
            const tokenSalvo = await AsyncStorage.getItem('token');
            const nomeSalvo = await AsyncStorage.getItem('nome');
            const emailSalvo = await AsyncStorage.getItem('email');

            if (tokenSalvo && nomeSalvo) {
                setToken(tokenSalvo);

                setUsuario({
                    nome: nomeSalvo,
                    email: emailSalvo
                });
            }
        } catch (erro) {
            console.log('Erro ao recuperar sessão:', erro);
        } finally {
            setCarregando(false);
        }
    }

    async function entrar(email, senha) {
        const resposta = await fazerLogin(email, senha);

        await AsyncStorage.setItem('token', resposta.token);
        await AsyncStorage.setItem('nome', resposta.nome);
        await AsyncStorage.setItem('email', email);

        setToken(resposta.token);

        setUsuario({
            nome: resposta.nome,
            email: email
        });
    }

    async function sair() {
        await AsyncStorage.multiRemove(['token', 'nome', 'email']);

        setToken(null);
        setUsuario(null);
    }

    return (
        <SessaoContext.Provider value={{
            usuario,
            token,
            carregando,
            entrar,
            sair
        }}>
            {children}
        </SessaoContext.Provider>
    );
}

export function useSessao() {
    const contexto = useContext(SessaoContext);

    if (!contexto) {
        throw new Error('useSessao precisa estar dentro de SessaoProvider');
    }

    return contexto;
}