# Controle de Gastos

Aplicativo mobile para **controlar receitas e despesas pessoais**, desenvolvido com **React Native (Expo)** no frontend e **Spring Boot** no backend, com autenticação **JWT** e banco de dados relacional.

## Descrição e problema que resolve

Muitas pessoas, principalmente estudantes, não sabem para onde vai o dinheiro no fim do mês. O Controle de Gastos permite:

- registrar **receitas** e **despesas**, com valor, categoria, descrição e data;
- acompanhar o **saldo total**, o total de entradas e o total de saídas;
- **filtrar** as transações por categoria;
- ver um **resumo mensal** com o gasto por categoria, em gráfico e em percentual;
- manter os dados **separados por usuário**: cada pessoa só enxerga as próprias transações.

## Integrantes

| Nome completo | RM | Responsabilidades |
|---|---|---|
| Gustavo Bordinasso | Backend: entidades, repositories, segurança (JWT, `JwtService`, `JwtFilter`, `SecurityConfig`) e resposta do login com token. Frontend: tela Home |
| Gabriel Groppo | Backend: cadastro e login (`AutenticacaoController` e `AutenticacaoService`) e CORS. Frontend: telas de Login e Cadastro, Context de sessão, AsyncStorage e configuração do Axios |
| Guilherme Alves de Souza | Backend: CRUD de despesas e tratamento de erros. Frontend: tela de Formulário (nova transação e edição) |
| Nayana Oliveira | Backend: endpoint de resumo e validações. Frontend: tela de Resumo/Perfil e gráfico de rosca |

## Telas

| Tela | O que faz |
|---|---|
| **Login** | Entra com e-mail e senha, recebe o token JWT e guarda a sessão |
| **Cadastro** | Cria uma conta nova |
| **Home** | Lista as transações, mostra o saldo, filtra por categoria e exclui |
| **Formulário** | Cadastra uma nova receita ou despesa e edita uma existente |
| **Resumo/Perfil** | Mostra o gasto do mês por categoria em um gráfico e permite sair da conta |

## Tecnologias

**Backend**
- Java 17 e Spring Boot 4.1.2
- Spring Web MVC, Spring Data JPA (Hibernate) e Bean Validation
- Spring Security com autenticação **JWT** (biblioteca jjwt 0.12.6) e senhas com **BCrypt**
- Banco de dados relacional **H2** (em modo arquivo)
- Documentação da API com Swagger (springdoc)

**Frontend**
- React Native 0.88 com Expo (SDK 58) e React 19
- **Context API** para o estado global da sessão e `useState`/`useEffect` para o estado das telas
- **AsyncStorage** para guardar o token e os dados do usuário no aparelho
- **Axios** para a comunicação com a API REST, com interceptor que envia o token em toda requisição
- react-native-svg (gráfico), expo-linear-gradient e @expo/vector-icons

## Requisitos atendidos

| Requisito | Onde está |
|---|---|
| Frontend em React Native com pelo menos 5 telas, incluindo login | Pasta `frontend/src/screens` |
| Navegação entre telas | `frontend/App.js`: o fluxo entre Login, Cadastro, abas (Home e Resumo) e Formulário é controlado por estado |
| Autenticação JWT no Spring Boot | Pasta `backend/.../security` e `AutenticacaoController` |
| API REST entre frontend e backend | `frontend/src/services` (Axios) e os controllers do backend |
| Gerenciamento de estado | `frontend/src/contexts/sessao.js` (Context API) e estados locais das telas |
| AsyncStorage | `sessao.js` guarda `token`, `nome` e `email`; `api.js` lê o `token` |
| Banco de dados relacional | H2, com as tabelas `usuario` e `despesa` |
| Cadastro, consulta, atualização e exclusão | Formulário (criar e editar), Home e Resumo (consultar) e Home (excluir) |

## Estrutura do projeto

```
Controle-de-Gastos/
├── backend/                         API Spring Boot
│   └── src/main/java/com/backend/gastos/
│       ├── controller/              AutenticacaoController, DespesaController, ResumoController
│       ├── service/                 AutenticacaoService, DespesaService, ResumoService
│       ├── repository/              UsuarioRepository, DespesaRepository
│       ├── model/                   Usuario, Despesa, TipoTransacao
│       ├── dto/                     objetos de entrada e saída da API
│       ├── security/                JwtService, JwtFilter, SecurityConfig, UsuarioLogado
│       ├── exception/               exceções e GlobalExceptionHandler
│       └── config/                  ClockConfig, CorsConfig
├── frontend/                        App React Native (Expo)
│   ├── App.js                       controle das telas e da barra de abas
│   └── src/
│       ├── screens/                 Login, Cadastro, Home, Form, Resumo
│       ├── components/              DespesaItem, DonutChart
│       ├── contexts/                sessao.js (Context API)
│       ├── services/                api.js, autenticacaoService, despesaService, resumoService
│       ├── constants/               categorias.js
│       └── utils/                   formatar.js, alerta.js
└── README.md
```

## Modelo de dados

```
usuario (id, nome, email [único], senha [hash BCrypt])
despesa (id, descricao, valor, tipo [RECEITA | DESPESA], categoria, data, usuario_id -> usuario.id)
```

A tabela `despesa` guarda tanto receitas quanto despesas, diferenciadas pelo campo `tipo`. As categorias disponíveis são: Alimentação, Transporte, Casa, Saúde, Lazer e Outros.

## Como executar

### Pré-requisitos

- Java 17 ou superior
- Node.js (versão LTS recente) e npm
- Aplicativo **Expo Go** no celular (ou um emulador Android/iOS)
- Celular e computador **na mesma rede Wi-Fi**

### 1. Backend

```bash
cd backend
./mvnw spring-boot:run        # no Windows: .\mvnw.cmd spring-boot:run
```

A API sobe em `http://localhost:8080`. O banco H2 é criado automaticamente na pasta `backend/data/`.

| Recurso | Endereço |
|---|---|
| Swagger (documentação da API) | http://localhost:8080/swagger-ui.html |
| Console do H2 | http://localhost:8080/h2-console |

No console do H2, use a URL `jdbc:h2:file:./data/gastosdb`, o usuário `admin` e a senha `controle_admin2026`.

### 2. Frontend

Em outro terminal, com o backend rodando:

```bash
cd frontend
npm install
npx expo start
```

Leia o QR code com o Expo Go (Android) ou com a câmera (iOS). Para abrir no navegador, pressione `w` no terminal.

**Sobre o endereço da API:** o arquivo `frontend/src/services/api.js` descobre sozinho o IP do computador que está rodando o Expo e usa `http://<IP>:8080`. Por isso o celular precisa estar na mesma rede. Se o app não conseguir conectar, confira se o firewall do computador permite conexões na porta 8080 e não use o modo `--tunnel` do Expo.

### 3. Primeiro uso

1. Abra o app e toque em **Cadastre-se** para criar uma conta.
2. Faça o login.
3. Na Home, toque no botão **+** para registrar uma receita ou uma despesa.
4. Veja o gráfico por categoria na aba **Resumo**.

## Endpoints da API

Todas as rotas, exceto `/auth/**`, exigem o cabeçalho `Authorization: Bearer <token>`.

| Método | Rota | Descrição |
|---|---|---|
| POST | `/auth/register` | Cadastra um usuário |
| POST | `/auth/login` | Autentica e devolve `{ token, nome }` |
| GET | `/despesas` | Lista as transações do usuário logado (filtro opcional: `?categoria=`) |
| GET | `/despesas/{id}` | Busca uma transação |
| POST | `/despesas` | Cria uma transação |
| PUT | `/despesas/{id}` | Atualiza uma transação |
| DELETE | `/despesas/{id}` | Exclui uma transação |
| GET | `/despesas/resumo` | Gasto por categoria no mês (opcional: `?mes=&ano=`) |

Exemplo de corpo para `POST /despesas`:

```json
{
  "descricao": "Supermercado",
  "valor": 156.00,
  "tipo": "DESPESA",
  "categoria": "Alimentação",
  "data": "2026-11-18"
}
```

Os erros seguem um formato único: `{ timestamp, status, erro, mensagem, caminho }`.

## Como funciona a autenticação

1. No **login**, o backend confere o e-mail e a senha (hash BCrypt) e devolve um **token JWT** com o id do usuário e validade de 24 horas.
2. O app guarda o token no **AsyncStorage** e o usuário no **Context** (`useSessao`).
3. O interceptor do **Axios** envia o token no cabeçalho `Authorization` de toda requisição.
4. No backend, o **`JwtFilter`** lê o token, valida a assinatura e identifica o usuário. Sem token válido, a resposta é **401**.
5. Cada consulta filtra os dados pelo usuário do token, então ninguém acessa as transações de outra pessoa.
6. Ao reabrir o app, a sessão é recuperada do AsyncStorage e o usuário continua logado. O botão **Sair da Conta** apaga esses dados.

## Observações

- O banco **H2** foi escolhido para facilitar a execução e a avaliação do projeto. Como o acesso é feito pelo JPA, a troca por **MySQL** exige apenas substituir a dependência `h2` por `mysql-connector-j` no `pom.xml` e ajustar as propriedades de conexão em `application.properties`.
- Por ser um projeto acadêmico, a senha do banco e a chave do JWT ficam no `application.properties`. Em um ambiente real, esses valores seriam variáveis de ambiente.
