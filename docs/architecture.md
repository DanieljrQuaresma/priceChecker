# Arquitetura inicial

## Princípios

- Começar com uma única aplicação Next.js.
- Manter a recolha de preços desacoplada da interface.
- Guardar preços com data de observação.
- Separar produto genérico, produto vendido pelo supermercado e preço.
- Não depender de scraping para demonstrar o primeiro MVP.

## Entidades previstas

- `users`
- `supermarkets`
- `products`
- `supermarket_products`
- `price_observations`
- `recipes`
- `recipe_ingredients`

## Fluxo principal

1. O utilizador cria uma receita.
2. Adiciona ingredientes e quantidades.
3. Cada ingrediente é associado a produtos equivalentes.
4. O sistema normaliza o preço para a quantidade necessária.
5. Soma o custo por supermercado.
6. Apresenta a opção mais económica e a diferença de preço.

## Decisões adiadas

- Aplicação móvel nativa.
- Recolha automática em larga escala.
- Integrações comerciais com supermercados.
- Otimização de uma compra repartida entre várias lojas.
- Substituições automáticas por preferência nutricional.
