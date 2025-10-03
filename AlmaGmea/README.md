# 🔮 Alma Gêmea - Método Serena

Uma aplicação web mística para descobrir sua alma gêmea através do Método Serena, combinando tecnologia moderna com elementos místicos.

## ✨ Funcionalidades

- **Formulário Interativo**: Processo em múltiplas etapas para coleta de dados
- **Análise Mística**: Algoritmo baseado em características pessoais
- **Relógio em Tempo Real**: Exibição de horário atual nos modais
- **Integração Supabase**: Salvamento automático de dados na nuvem
- **Facebook Pixel**: Rastreamento de conversões
- **Redirecionamento Kirvano**: Checkout integrado para pagamentos

## 🚀 Tecnologias

### Frontend
- **React 18** com TypeScript
- **Vite** para build e desenvolvimento
- **Tailwind CSS** para estilização
- **Radix UI** para componentes
- **Framer Motion** para animações

### Backend
- **Node.js** com Express
- **Python Flask** para API
- **SQLite** para banco local
- **Supabase** para banco em nuvem

### Integrações
- **Supabase** para persistência de dados
- **Facebook Pixel** para analytics
- **Kirvano** para pagamentos

## 📦 Instalação

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/seu-usuario/alma-gemea.git
   cd alma-gemea
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Configure o Supabase:**
   - Crie um projeto no [Supabase](https://supabase.com)
   - Execute o SQL do arquivo `setup_supabase.sql`
   - Configure as variáveis de ambiente

4. **Inicie o desenvolvimento:**
   ```bash
   npm run dev
   ```

## 🔧 Configuração

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
# Supabase
SUPABASE_URL=sua_url_do_supabase
SUPABASE_ANON_KEY=sua_chave_anonima

# Facebook Pixel (opcional)
FACEBOOK_PIXEL_ID=seu_pixel_id
FACEBOOK_ACCESS_TOKEN=seu_access_token
```

### Supabase Setup

Execute este SQL no editor SQL do Supabase:

```sql
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  city VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "Allow insert for all users" ON users
  FOR INSERT WITH CHECK (true);

CREATE POLICY IF NOT EXISTS "Allow read for all users" ON users
  FOR SELECT USING (true);
```

## 🎯 Como Usar

1. **Acesse a aplicação** em `http://localhost:3001`
2. **Preencha o formulário** com seus dados
3. **Aguarde a análise** do Método Serena
4. **Visualize o resultado** personalizado
5. **Confirme o pagamento** para acessar o resultado completo

## 📊 Estrutura do Projeto

```
alma-gemea/
├── client/                 # Frontend React
│   ├── src/
│   │   ├── components/     # Componentes reutilizáveis
│   │   ├── pages/          # Páginas da aplicação
│   │   └── lib/           # Utilitários
├── server/                # Backend Express
│   ├── index.ts           # Servidor principal
│   ├── routes.ts          # Rotas da API
│   └── vite.ts            # Configuração Vite
├── backend/               # API Python Flask
│   ├── main.py           # Servidor Flask
│   ├── profiles.py       # Perfis de alma gêmea
│   └── requirements.txt   # Dependências Python
└── shared/                # Código compartilhado
    └── schema.ts          # Tipos TypeScript
```

## 🔄 Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Constrói para produção
- `npm run check` - Verifica tipos TypeScript
- `npm run db:push` - Atualiza schema do banco

## 🎨 Design

O projeto utiliza um design místico com:
- **Cores**: Roxos profundos, magentas vibrantes e dourados
- **Tipografia**: Fontes serifadas para elegância
- **Animações**: Transições suaves e efeitos místicos
- **Responsivo**: Adaptado para mobile e desktop

## 📈 Analytics

- **Facebook Pixel** integrado para rastreamento
- **Conversões** rastreadas automaticamente
- **Leads** salvos no Supabase
- **Métricas** de conversão disponíveis

## 🛠️ Desenvolvimento

### Adicionando Novos Perfis

Edite o arquivo `backend/profiles.py` para adicionar novos perfis de alma gêmea.

### Customizando o Design

Modifique os arquivos CSS em `client/src/` e os componentes em `client/src/components/`.

### Integrando Novos Serviços

Adicione novas integrações em `server/routes.ts` e configure as variáveis de ambiente.

## 📝 Licença

Este projeto é privado e proprietário.

## 🤝 Contribuição

Para contribuir com o projeto, entre em contato com a equipe de desenvolvimento.

---

**Desenvolvido com ❤️ para conectar almas gêmeas através do Método Serena**
