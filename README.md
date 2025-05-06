# Sweet Shop - backend

## Descrição

Aplicação backend construída com NestJS, projetada para gerenciar dados relacionados à docerias. Ele fornece funcionalidades para gerenciamento de usuários, permissões, produtos, categorias, fornecedores, movimentações de estoque, vendas, relatórios e fluxo de caixa.

## Funcionalidades

- **Gerenciamento de Usuários:**
  - Criar, atualizar e deletar usuários.
  - Autenticação e autorização usando JWT.
  - Criptografia de senhas.
  - Controle de acesso baseado em permissões do usuário.
- **Gerenciamento de Permissões:**
  - Criar, atualizar e deletar permissões de usuários.
- **Gerenciamento de Produtos:**
  - Criar, visualizar, atualizar e deletar produtos.
  - Associar produtos com categorias e fornecedores.
- **Gerenciamento de Categorias:**
  - Criar, visualizar, atualizar e deletar categorias de produtos.
- **Gerenciamento de Fornecedores:**
  - Criar, visualizar, atualizar e deletar fornecedores.
- **Gerenciamento de Movimentações de Estoque:**
  - Registrar entradas e saídas de estoque.
  - Acompanhar o nível de estoque de cada produto.
- **Gerenciamento de Vendas:**
  - Registrar novas vendas.
  - Controlar itens vendidos e atualizar o estoque dos produtos automaticamente.
- **Relatórios:**
  - Gerar relatórios de vendas agrupados por mês.
  - Identificar os produtos mais vendidos.
- **Gestão de Fluxo de Caixa:**
  - Calcular o fluxo de caixa com base em vendas e movimentações de estoque em um determinado período.
- **Documentação da API:**
  - Documentação interativa da API usando Swagger.

## Tecnologias Utilizadas

- [Node.js](https://nodejs.org/)
- [Typescript](https://www.typescriptlang.org/)
- [NestJS](https://nestjs.com/)
- [Prisma](https://www.prisma.io/)
- [PostgreSQL](https://www.postgresql.org/)
- [bcryptjs](https://www.npmjs.com/package/bcryptjs)
- [class-validator](https://github.com/typestack/class-validator)
- [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken)
- [dotenv](https://github.com/motdotla/dotenv)
- [Swagger](https://swagger.io/)
- [eslint](https://eslint.org/)
- [prettier](https://prettier.io/)
- [Jest](https://jestjs.io/)

## Pré-requisitos

- [Node.js](https://nodejs.org/) (>= 16.0)
- [npm](https://www.npmjs.com/) (>= 8.0) or [Yarn](https://yarnpkg.com/) (>= 1.22)
- [PostgreSQL](https://www.postgresql.org/)
- [Docker](https://www.docker.com/)

## Instruções de Instalação

1.  **Clone o repositório:**

    ```bash
    git clone https://github.com/IosdanFerreira/sweet-shop-back.git
    cd sweet-shop-back
    ```

2.  **Configurar variáveis de ambiente:**

    - Crie um arquivo `.env` na pasta root do repositório.
    - Adicione as seguintes variáveis, ajustando os valores conforme sua configuração local:

    ```env
    ENV=development
    APP_PORT=3001
    DATABASE_URL="postgresql://postgres:sweet-shop-back-secret@db:5432/sweet-shop-back?schema=public&timezone=America/Sao_Paulo"
    JWT_SECRET="jwt_secret"
    JWT_EXPIRES_IN_SECONDS=3600
    JWT_EXPIRES_IN_LITERAL_STRING_VALUE='1h'
    REFRESH_JWT_SECRET="refresh_jwt_secret"
    REFRESH_JWT_EXPIRES_IN_SECONDS=604800
    REFRESH_JWT_EXPIRES_IN_LITERAL_STRING_VALUE='7d'
    ```

3.  **Conceda as permissões:**

    ```bash
    chmod +x .docker/entrypoint.sh
    ```

4.  **Rode os comando docker:**

    Construa a build

    ```bash
    docker compose build

    #Ou caso queira limpar o cache

    docker compose build --no-cache
    ```

    suba o container

    ```bash
    docker compose up
    ```

## Guia de uso

1.  **Acesse a aplicação:**

    Abra seu navegador e acesse `http://localhost:3001`.

2.  **Acesse a documentação do Swagger:**

    Navegue até `http://localhost:3001/api` para interagir com a documentação da API.

3.  **Autenticação:**

    - Utilize o endpoint `/user/login` para autenticar-se e obter um access token e um refresh token. Forneça as credenciais (e-mail e senha) de um usuário previamente cadastrado. Os usuários padrão gerados pelo comando de seed podem ser utilizados para testes iniciais.
    - O access token deve ser incluído no cabeçalho `Authorization` das requisições subsequentes a rotas protegidas, no formato `Bearer <token>`.
    - Para renovar o access token, utilize o endpoint `/user/refreshToken` enviando um refresh token válido.

## Documentação da API

A documentação da API está disponível via Swagger no endpoint /api. Os principais endpoints incluem:

- **`POST /user/signup`**: Registra um novo usuário.

  - Exemplo:

    ```json
    {
      "first_name": "John",
      "last_name": "Doe",
      "email": "john.doe@example.com",
      "password": "Password123!@",
      "phone": "(11) 99999-9999",
      "privacy_consent": true,
      "role_id": 1
    }
    ```

- **`POST /user/login`**: Realiza o login de um usuário existente.

  - Exemplo:

    ```json
    {
      "email": "john.doe@example.com",
      "password": "Password123!"
    }
    ```

- **`GET /user/:id`**: Busca um usuário pelo ID. Requer autenticação JWT.

- **`POST /roles`**: Cria uma nova permissão(role). Requer autenticação JWT.

  - Exemplo:

    ```json
    {
      "name": "Manager"
    }
    ```

- **`GET /categories`**: Retorna a lista de categorias. Requer autenticação JWT. Suporta paginação e buscas com filtros.

  - Exemplo: `GET /categories?page=1&limit=10&order_by=asc&search=Cereais`

- **`POST /products`**: Cadastra um novo produto. Requer autenticação JWT.

  - Exemplo:

    ```json
    {
      "name": "Novo Produto",
      "description": "Descrição do novo produto",
      "purchase_price": 500,
      "selling_price": 800,
      "stock": 100,
      "category_id": 1,
      "supplier_id": 1
    }
    ```

- **`POST /sales`**: Registra uma nova venda. Requer autenticação JWT.

  - Exemplo:

    ```json
    {
      "items": [
        {
          "product_id": 1,
          "quantity": 2
        },
        {
          "product_id": 2,
          "quantity": 3
        }
      ]
    }
    ```

- **`GET /cash-flow`**: Consulta o fluxo de caixa com base em intervalo de datas. Requer autenticação JWT.

  - Exemplo: `/cash-flow?start_date=01/01/2024&end_date=31/01/2024`

- **`POST /stock-movements/increase`**: Registra um aumento de estoque para um produto. Requer autenticação JWT.

  - Exemplo:

    ```json
    {
      "product_id": 1,
      "quantity": 50
    }
    ```
