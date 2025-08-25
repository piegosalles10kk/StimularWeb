# BackOffice Stimular - Painel Administrativo

## 📋 Descrição do Projeto

O **BackOffice Stimular** é o painel administrativo web do sistema Stimular, desenvolvido para gerenciamento completo da plataforma. Esta aplicação permite aos administradores controlar usuários, atividades, conteúdo do mural e monitorar estatísticas em tempo real através de uma interface intuitiva e responsiva.

> ⚠️ **Importante**: Este painel é exclusivo para administradores com privilégios especiais. O acesso é restrito e protegido por autenticação JWT.

## 🎯 Funcionalidades Principais

### 📊 Dashboard Analítico
- **Métricas em tempo real**: Pacientes cadastrados, usuários pagantes e receita estimada
- **Gráficos evolutivos**: Visualização temporal das principais métricas
- **Dados atualizáveis**: Sistema de refresh manual para dados mais recentes
- **Estimativas de receita**: Cálculos baseados em assinaturas ativas

### 👥 Gerenciamento de Usuários
- **CRUD completo**: Criar, visualizar, editar e desativar usuários
- **Filtros avançados**: Busca por nome, email, telefone ou tipo de conta
- **Gestão de validade**: Controle de período de acesso para pacientes
- **Upload de foto**: Sistema de envio de imagem de perfil
- **Tipos de conta**: Paciente, Profissional e Admin com permissões diferenciadas

### 🎮 Gestão de Atividades
- **Criação de atividades**: Interface completa para desenvolvimento de exercícios
- **Sistema multimídia**: Suporte a imagens, vídeos e GIFs
- **Categorização avançada**: 5 áreas de desenvolvimento (Socialização, Cognição, Linguagem, Auto Cuidado, Motor)
- **Exercícios interativos**: Sistema de alternativas múltiplas com feedback
- **Edição em tempo real**: Modificação de atividades existentes

### 📢 Mural de Comunicação
- **Gestão de conteúdo**: Criação e edição de posts para o aplicativo
- **Preview em tempo real**: Visualização imediata das alterações
- **Sistema de mídia**: Upload de imagens e vídeos
- **Controle de autoria**: Identificação automática do criador

### 🖼️ Gestão de Marca
- **Alteração de logo**: Sistema de upload para logo da aplicação
- **Preview instantâneo**: Visualização antes da publicação
- **Cache inteligente**: Controle de atualizações de imagem

## 🏗️ Arquitetura do Sistema

### 📂 Estrutura de Pastas

```
src/
├── 🚪 App.js                    # Componente principal com autenticação
├── 🎨 App.css                   # Estilos globais
├── 📱 index.js                  # Ponto de entrada da aplicação
├── 🎪 componentes/              # Componentes reutilizáveis
│   ├── box.js                   # Componente de métricas
│   └── grafico.js               # Componente de gráficos
├── 🗂️ tabs/                     # Páginas principais
│   ├── Home.js                  # Dashboard principal
│   ├── Usuarios.js              # Gestão de usuários
│   ├── GrupoAtividades.js       # Gestão de atividades
│   ├── Mural.js                 # Gestão do mural
│   ├── AuthProvider.js          # Contexto de autenticação
│   └── StimularUpdates.js       # Notas de atualização
├── 🔧 utils/                    # Utilitários
│   ├── api.js                   # Configurações da API
│   └── tokenMidia.js            # Token de acesso às mídias
└── 🎨 assets/                   # Recursos estáticos
    └── Logo.png                 # Logo da aplicação
```

## 🔐 Sistema de Autenticação

### Processo de Login
1. **Validação de credenciais**: Email e senha são verificados via API
2. **Verificação de privilégios**: Apenas usuários do tipo "Admin" têm acesso
3. **Geração de token JWT**: Token é armazenado localmente para sessões
4. **Proteção de rotas**: Todas as páginas requerem autenticação válida

### Estrutura de Autenticação
```javascript
// Fluxo de login
POST /auth/login → Validação → JWT Token → Acesso ao painel

// Estrutura do token
{
  id: "ID do administrador",
  tipoDeConta: "Admin",
  ativo: true
}
```

## 📊 Páginas e Funcionalidades

### 🏠 Home - Dashboard Principal

#### **Métricas Principais**
- **Pacientes Cadastrados**: Total de contas de pacientes na plataforma
- **Usuários Pagantes**: Estimativa baseada em usuários com acesso ativo
- **Receita Estimada**: Cálculo baseado no valor da assinatura (R$ 99,99)

#### **Gráficos Evolutivos**
- **Visualização temporal**: Gráficos de linha mostrando evolução das métricas
- **Dados históricos**: Comparação de performance ao longo do tempo
- **Refresh manual**: Botão para atualização de dados em tempo real

#### **Gestão de Logo**
```javascript
// Sistema de upload de logo
1. Seleção de arquivo (JPEG/PNG)
2. Preview instantâneo
3. Upload para Azure Blob Storage
4. Atualização automática na aplicação
```

#### **Notas de Atualização**
- **Changelog dinâmico**: Lista de tarefas e melhorias
- **Status de progresso**: Indicadores visuais de conclusão
- **Categorização**: Diferentes tipos de tarefas (Bug, Feature, Enhancement)

### 👤 Usuarios - Gestão Completa de Usuários

#### **Funcionalidades de Busca e Filtro**
```javascript
// Filtros disponíveis
- Busca textual: Nome, email, telefone
- Filtro por tipo: Paciente, Profissional, Admin
- Visualização em tabela responsiva
```

#### **Criação de Usuários**
- **Formulário completo**: Dados pessoais e configurações de conta
- **Validações automáticas**: Formato de email, telefone e data
- **Configurações padrão**:
  - Senha inicial: "stimular2024@"
  - Conquistas básicas pré-definidas
  - Profissionais atribuídos automaticamente
  - Sistema de moedas inicial

#### **Edição de Usuários**
- **Upload de foto**: Sistema integrado com Azure Storage
- **Gestão de validade**: Controle de dias de acesso para pacientes
- **Atualização de dados**: Modificação de informações pessoais
- **Controle de status**: Ativação/desativação de contas

#### **Sistema de Validade**
```javascript
// Gestão de validade para pacientes
const updateValidity = (userId, days) => {
    // Calcula nova data de expiração
    // Atualiza via API
    // Confirma alteração
};
```

### 🎯 GrupoAtividades - Criação e Gestão de Atividades

#### **Sistema de Criação de Atividades**
```javascript
// Estrutura de uma atividade
{
    nomdeDaAtividade: String,
    fotoDaAtividade: File/URL,
    descicaoDaAtividade: String,
    tipoDeAtividade: Enum, // 5 tipos disponíveis
    marco: String,
    idade: Number,
    exercicios: [Exercicio]
}
```

#### **Tipos de Atividade**
1. **Socialização**: Desenvolvimento de habilidades sociais
2. **Cognição**: Estimulação cognitiva e raciocínio
3. **Linguagem**: Desenvolvimento da comunicação
4. **Auto Cuidado**: Habilidades de vida diária
5. **Motor**: Desenvolvimento motor fino e grosso

#### **Sistema de Exercícios**
```javascript
// Estrutura de um exercício
{
    midia: {
        tipoDeMidia: "image|video|gif",
        url: String
    },
    enunciado: String,
    alternativas: [{
        alternativa: String,
        resultadoAlternativa: Boolean
    }],
    pontuacao: Number
}
```

#### **Upload Multimídia**
- **Tipos suportados**: JPEG, PNG, MP4, WebM
- **Preview instantâneo**: Visualização antes do upload
- **Integração Azure**: Armazenamento seguro na nuvem
- **Tokens de acesso**: URLs protegidas para mídias

#### **Sistema de Alternativas**
- **Múltipla escolha**: Sistema de respostas com feedback
- **Marcação de corretas**: Identificação das respostas válidas
- **Edição dinâmica**: Adição/remoção de alternativas em tempo real
- **Validação**: Verificação de integridade antes do salvamento

### 📢 Mural - Gestão de Conteúdo

#### **Sistema de Posts**
```javascript
// Estrutura de um post no mural
{
    titulo: String,
    autor: String, // Padrão: "Equipe Stimular"
    conteudo: String,
    midia: {
        tipoDeMidia: "image|video",
        url: String
    },
    dataCriacao: Date
}
```

#### **Preview em Tempo Real**
- **Visualização instantânea**: Interface que simula o app mobile
- **Layout responsivo**: Adaptação para diferentes tamanhos
- **Feedback visual**: Indicadores de mídia e conteúdo

#### **Sistema de Mídia**
- **Upload integrado**: Envio de imagens e vídeos
- **Tipos suportados**: Formatos otimizados para mobile
- **Compressão automática**: Otimização para performance

## 🔧 Tecnologias Utilizadas

### **Frontend**
- **React 18**: Framework JavaScript para interfaces
- **React Router DOM**: Navegação entre páginas
- **React Bootstrap**: Componentes UI responsivos
- **Recharts**: Biblioteca para gráficos e visualizações

### **Componentes Bootstrap**
```javascript
// Componentes principais utilizados
import { 
    Button, Form, Table, Image, 
    Modal, Card, Container, Row, Col,
    Nav, Dropdown
} from 'react-bootstrap';
```

### **Integração com APIs**
- **Fetch API**: Comunicação com backend
- **JWT Authentication**: Sistema de tokens
- **FormData**: Upload de arquivos
- **Azure Blob Storage**: Armazenamento de mídias

## 🚀 Instalação e Configuração

### Pré-requisitos
- **Node.js 16+**: Runtime JavaScript
- **npm ou yarn**: Gerenciador de pacotes
- **Backend Stimular**: API funcionando
- **Conta Azure**: Para armazenamento de mídias

### Passo a Passo

```bash
# 1. Clone o repositório
git clone [repository-url]
cd stimular-backoffice

# 2. Instale as dependências
npm install

# 3. Configure as variáveis de ambiente
# Edite src/utils/api.js com a URL do backend
export const api = "https://sua-api.com";

# 4. Configure o token de mídia
# Edite src/utils/tokenMidia.js com seu token Azure
export const tokenMidia = "seu-token-aqui";

# 5. Inicie a aplicação
npm start

# 6. Acesse no navegador
http://localhost:3000
```

### Configurações Essenciais

#### **API Configuration (src/utils/api.js)**
```javascript
export const api = "https://stimularbackend.fly.dev";
export const api1 = "http://localhost:3001"; // Desenvolvimento local
```

#### **Media Token (src/utils/tokenMidia.js)**
```javascript
// Token SAS para Azure Blob Storage
export const tokenMidia = "?sv=2022-11-02&ss=b&srt=sco&sp=rwdlaciytfx&se=2030-12-31T21:19:23Z&st=2024-11-13T13:19:23Z&spr=https&sig=RWvgyvXeVR7oCEwzfniPRRLQiA9sByWY8bnqP1d3LtI%3D";
```

## 📋 Fluxos de Trabalho

### **Fluxo de Criação de Atividade**
```
1. Acesso à aba "Atividades"
2. Clique em "Criar Atividade"
3. Preenchimento dos dados básicos
4. Upload da imagem da atividade
5. Seleção do tipo e marco de desenvolvimento
6. Adição de exercício com mídia
7. Criação de alternativas múltiplas
8. Marcação de respostas corretas
9. Salvamento e validação
10. Atividade disponível na plataforma
```

### **Fluxo de Gestão de Usuário**
```
1. Acesso à aba "Usuários"
2. Busca ou filtro por tipo
3. Seleção do usuário desejado
4. Edição de dados pessoais
5. Gestão de validade (pacientes)
6. Upload de nova foto (opcional)
7. Salvamento das alterações
8. Confirmação de sucesso
```

### **Fluxo de Atualização do Mural**
```
1. Acesso à aba "Mural"
2. Edição do conteúdo atual
3. Upload de nova mídia (opcional)
4. Preview em tempo real
5. Confirmação das alterações
6. Publicação no aplicativo
7. Notificação de sucesso
```

## 🎨 Componentes Reutilizáveis

### **Box Component (src/componentes/box.js)**
```javascript
// Exibe métricas com título e subtítulo
function Box({ titulo, subtitulo }) {
    return (
        <div style={{ textAlign: "center", padding: "20px" }}>
            <h1>{titulo}</h1>
            <h2>{subtitulo}</h2>
        </div>
    );
}
```

### **Grafico Component (src/componentes/grafico.js)**
```javascript
// Renderiza gráficos de linha responsivos
function Grafico({ data }) {
    return (
        <ResponsiveContainer width="100%" height={250}>
            <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="valor" stroke="#007bff" strokeWidth={2} />
            </LineChart>
        </ResponsiveContainer>
    );
}
```

## 🔒 Segurança e Autenticação

### **Proteção de Rotas**
- **JWT Validation**: Verificação de token em cada requisição
- **Role-based Access**: Apenas admins têm acesso ao painel
- **Session Management**: Controle automático de sessões expiradas
- **Secure Storage**: Tokens armazenados com segurança

### **Validações de Input**
```javascript
// Exemplos de validações implementadas
- Email: Formato válido obrigatório
- Telefone: Apenas números aceitos
- Data: Formato DD/MM/AAAA
- Arquivos: Tipos e tamanhos limitados
```

### **Proteção contra Ataques**
- **XSS Prevention**: Sanitização de inputs
- **CSRF Protection**: Tokens de autenticação
- **File Upload Security**: Validação de tipos de arquivo
- **API Rate Limiting**: Controle de requisições

## 📊 Monitoramento e Analytics

### **Métricas Disponíveis**
1. **Usuários Cadastrados**: Total acumulativo
2. **Usuários Pagantes**: Baseado em status de validade
3. **Receita Estimada**: Cálculo R$ 99,99 × usuários ativos
4. **Crescimento**: Visualização temporal das métricas

### **Dados em Tempo Real**
- **Refresh Manual**: Botão para atualização imediata
- **Cache Inteligente**: Otimização de performance
- **Histórico**: Manutenção de dados históricos
- **Exportação**: Dados disponíveis para análise

## 🎯 Recursos Avançados

### **Sistema de Upload**
```javascript
// Upload para Azure Blob Storage
const handleUploadFile = async (type, id, file) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch(`${api}/midia/post/${id}`, {
        method: 'POST',
        body: formData,
        headers: { Authorization: `Bearer ${token}` }
    });
    
    return response.ok ? (await response.json()).url : null;
};
```

### **Gerenciamento de Estado**
- **Local State**: Uso de useState para componentes
- **Context API**: Compartilhamento de autenticação
- **Props Drilling**: Passagem de dados entre componentes
- **Callback Functions**: Comunicação entre componentes

### **Responsividade**
- **Bootstrap Grid**: Layout responsivo automático
- **Mobile First**: Design otimizado para dispositivos móveis
- **Breakpoints**: Adaptação para diferentes telas
- **Touch Friendly**: Interface otimizada para touch

## 🐛 Troubleshooting

### **Problemas Comuns**

#### **Erro de Autenticação**
```
Solução: Verificar se o token não expirou
localStorage.removeItem('authToken');
// Fazer login novamente
```

#### **Upload de Arquivo Falhando**
```
Verificar:
1. Tipo de arquivo suportado
2. Tamanho do arquivo (< 10MB)
3. Token de mídia válido
4. Conexão com Azure Storage
```

#### **Dados Não Carregando**
```
Verificar:
1. Conexão com a API
2. Token de autenticação válido
3. Permissões de administrador
4. Status do backend
```

### **Debug e Logs**
```javascript
// Console logs implementados para debug
console.log('Dados atualizados:', data);
console.error('Erro ao buscar dados:', error);
```

## 🔮 Roadmap e Melhorias Futuras

### **Funcionalidades Planejadas**
1. **Dashboard Avançado**: Mais métricas e gráficos
2. **Relatórios Automáticos**: Geração de PDFs
3. **Notificações Push**: Sistema de alertas
4. **Backup Automático**: Proteção de dados

### **Melhorias Técnicas**
1. **TypeScript**: Tipagem estática
2. **PWA**: Aplicação web progressiva
3. **Performance**: Otimizações de velocidade
4. **Testes**: Cobertura de testes automatizados
5. **CI/CD**: Pipeline de deploy automático

---

*Para mais informações técnicas sobre a API, consulte o [README da API]([./stimular_api_readme.md](https://github.com/piegosalles10kk/StimularBackEnd/blob/e4a3d72a260a2b3833296ced1249f42fc1917dd7/README.md)) ou entre em contato com a equipe de desenvolvimento.*
