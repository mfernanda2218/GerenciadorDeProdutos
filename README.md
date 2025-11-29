# Gerenciador de Estoque - Dashboard Completo

Um sistema completo de gerenciamento de estoque com login via GitHub/Google/Email, CRUD de produtos, busca em tempo real, preços de custo e venda, controle de estoque com cores, edição e exclusão — tudo lindo com **Next.js 14 (App Router)**, **Prisma**, **PostgreSQL**, **NextAuth.js** e **DaisyUI/Tailwind**.

**CRUD 100% funcional**  
**Login social + credenciais**  
**Busca instantânea**  
**Design moderno e responsivo**  
**Pronto pra produção ou vender como SaaS**


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

- Next.js 14 (App Router + Server Components)
- TypeScript
- Prisma + PostgreSQL
- NextAuth.js v4
- Tailwind CSS + DaisyUI
- Lucide Icons

---

### Como rodar o projeto (5 minutos)

```bash
# 1. Clone o repositório
git clone https://github.com/seu-usuario/GerenciadorDeProdutos.git
cd GerenciadorDeProdutos

# 2. Instale as dependências
npm install
# ou
yarn
# ou
pnpm install

# 3. Copie o .env.example para .env.local
cp .env.example .env.local

# 4. Preencha as variáveis no .env.local
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/gerenciador?schema=public"
NEXTAUTH_SECRET="uma-string-aleatoria-muito-forte-aqui"
NEXTAUTH_URL="http://localhost:3000"

# GitHub OAuth (opcional, mas recomendado)
GITHUB_ID=seu_github_client_id
GITHUB_SECRET=seu_github_client_secret

# Google OAuth (opcional)
GOOGLE_CLIENT_ID=seu_google_client_id
GOOGLE_CLIENT_SECRET=seu_google_client_secret
```

### Banco de Dados e seed

```bash
# 5. Rode as migrações
npx prisma migrate dev --name init

# 6. (Opcional) Crie o primeiro usuário + produtos de teste)
npx tsx prisma/seed.ts

# OU rode separadamente:
npx tsx prisma/seed.ts    # cria um usuário admin@teste.com
npx tsx prisma/seed-produtos.ts   # cadastra 15 produtos reais pra teste
```

### Iniciando o Projeto
```bash
# 7. Inicie o projeto
npm run dev
# ou
yarn dev
# ou
pnpm dev
```

Agora abra o navegador e acesse http://localhost:3000

---

### Login

- Email: admin@teste.com
- Senha: 123456
