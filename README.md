# 📦 Gerenciador de Estoque

Um sistema de alta performance para gerenciamento de inventário, desenvolvido com as tecnologias mais modernas do ecossistema JavaScript. Oferece controle total sobre produtos, fornecedores e níveis de estoque com uma interface premium e 100% responsiva.

[![Next.js](https://img.shields.io/badge/Next.js_16-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![GraphQL](https://img.shields.io/badge/GraphQL-E10098?style=for-the-badge&logo=graphql&logoColor=white)](https://graphql.org/)
[![NextAuth.js](https://img.shields.io/badge/Auth_v5-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://next-auth.js.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

---

### 🔥 Principais Funcionalidades

- **🔐 Autenticação Multi-Provedor**: Login via GitHub, Google ou Email/Senha utilizando o novo NextAuth v5.
- **📱 Layout 100% Responsivo**: Interface adaptável para celulares, tablets e desktops com Navbar dinâmica.
- **📊 Dashboard Inteligente**: Busca em tempo real e indicadores visuais de estoque (baixo, em falta, normal).
- **🛠️ CRUD Completo**: Gerenciamento ágil de produtos com suporte a preços de custo, venda e fornecedores.
- **🔒 Segurança Robusta**: Proteção de rotas via Middleware e validação de propriedade de dados no servidor.
- **⚡ Performance Máxima**: Utilização de Server Actions e Prisma para operações de banco de dados ultrarrápidas.

---

### 🚀 Tecnologias e Arquitetura

- **Core**: Next.js 16 (App Router) + React 18
- **API**: GraphQL (Apollo Server) para consultas complexas + Server Actions para mutações atômicas
- **Database**: PostgreSQL hospedado no Vercel/Neon com Prisma ORM
- **Auth**: NextAuth.js v5 (Beta) com Prisma Adapter
- **UI/UX**: Tailwind CSS + DaisyUI para componentes modernos e acessíveis
- **Validation**: Validação rigorosa de tipos com TypeScript e lógica de negócio isolada no servidor

---

### 🛠️ Como rodar o projeto localmente

```bash
# 1. Clone o repositório
git clone https://github.com/mfernanda2218/GerenciadorDeProdutos.git
cd GerenciadorDeProdutos

# 2. Instale as dependências
npm install

# 3. Configure as variáveis de ambiente
cp .env.example .env
# Preencha seu .env com as URLs do Banco de Dados e segredos do Auth
```

#### Configuração do Banco de Dados:
```bash
# 4. Gere o cliente Prisma e rode as migrações
npx prisma generate
npx prisma migrate dev --name init

# 5. (Opcional) Popule o banco com dados de teste
npx tsx prisma/seed-produtos.ts   # Cadastra 15 produtos reais para teste
```

#### Iniciando o servidor:
```bash
# 6. Rode em modo de desenvolvimento
npm run dev
```
Acesse [http://localhost:3000](http://localhost:3000) e faça login com os dados configurados.

---

### 🧪 Testes e Qualidade

O projeto utiliza **Playwright** para testes End-to-End (E2E) e **Jest** para testes unitários, garantindo a integridade do fluxo de gerenciamento:
```bash
npm run test          # Testes Unitários/Integração
npx playwright test   # Testes E2E (Simulação do Usuário)
```

---
*Desenvolvido com foco em escalabilidade e experiência do usuário.*
