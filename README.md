# Gerenciador de Estoque

Um sistema completo de gerenciamento de estoque com login via GitHub/Google/Email, CRUD de produtos, busca em tempo real, preços de custo e venda, controle de estoque com cores, edição e exclusão — tudo com:

[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![GraphQL](https://img.shields.io/badge/GraphQL-E10098?style=for-the-badge&logo=graphql&logoColor=white)](https://graphql.org/)
[![NextAuth.js](https://img.shields.io/badge/NextAuth.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://next-auth.js.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

---

### Funcionalidades

- Login com GitHub, Google ou Email/Senha
- Cadastro, edição e exclusão de produtos
- Controle de estoque com badges coloridos (verde, amarelo, vermelho)
- Busca em tempo real por nome ou fornecedor
- Interface limpa, moderna e totalmente responsiva
- Proteção total de rotas (você não acessa nada sem estar logado)

---

### Tecnologias Usadas

- **Frontend**: Next.js 14 (App Router + Server Components)
- **Backend**: API GraphQL com Apollo Server
- **Banco de Dados**: PostgreSQL com Prisma ORM
- **Autenticação**: NextAuth.js com múltiplos provedores
- **Estilização**: Tailwind CSS + DaisyUI
- **Testes**: Playwright para E2E

---

### Como rodar o projeto (5 minutos)

```bash
# 1. Clone o repositório e acesse a pasta
git clone https://github.com/seu-usuario/GerenciadorDeProdutos.git
cd GerenciadorDeProdutos

# 2. Instale as dependências
npm install
# ou
yarn
# ou
pnpm install

# 3. Copie o .env.example para .env.local e susbstitua com suas credenciais
cp .env.example .env.local

### Banco de Dados e seed

```bash
# 4. Rode as migrações
npx prisma migrate dev --name init

# 5. (Opcional) Crie o primeiro usuário + produtos de teste)
npx tsx prisma/seed.ts

# OU rode separadamente:
npx tsx prisma/seed.ts    # cria um usuário admin@teste.com
npx tsx prisma/seed-produtos.ts   # cadastra 15 produtos reais pra teste
```

### Iniciando o Projeto
```bash
# 6. Inicie o projeto
npm run dev
# ou
yarn dev
# ou
pnpm dev
```

Agora abra o navegador e acesse http://localhost:3000
