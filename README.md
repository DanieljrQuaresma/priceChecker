# PriceChecker

Aplicação web responsiva para comparar preços de produtos alimentares entre supermercados portugueses e calcular o custo de receitas.

## Objetivo do MVP

Validar uma primeira versão simples e funcional:

1. criar uma receita;
2. adicionar ingredientes;
3. associar produtos do Continente e do Pingo Doce/Mercadão;
4. calcular o custo da receita em cada supermercado;
5. apresentar a opção mais económica.

Nesta fase, os produtos e preços serão introduzidos de forma manual e controlada. A recolha automática de milhares de preços e a aplicação móvel nativa ficam fora do primeiro MVP.

## Stack

- Next.js com App Router
- TypeScript
- Tailwind CSS
- Supabase / PostgreSQL
- Supabase Auth
- Zod
- Vercel

A interface será escrita em português. O código, os nomes das tabelas e os campos da base de dados serão escritos em inglês.

## Âmbito inicial

- Supermercados: Continente e Pingo Doce/Mercadão
- Cerca de 30 produtos
- Cinco receitas de demonstração
- Registo, início e fim de sessão
- Gestão de receitas e ingredientes
- Comparação do custo total por supermercado
- Interface adaptada a computador e telemóvel

## Desenvolvimento local

### Requisitos

- Node.js 22 ou superior
- npm
- Projeto Supabase

### Configuração

```bash
npm install
copy .env.example .env.local
npm run dev
```

No macOS ou Linux, substitui `copy` por `cp`.

Depois, abre `http://localhost:3000`.

Nunca coloques credenciais reais no GitHub.

## Comandos

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run typecheck
```

## Estrutura

```text
src/
├── app/
├── components/
└── lib/
    └── supabase/
docs/
```

## Estado

Sprint 1 — Fundação do produto.
