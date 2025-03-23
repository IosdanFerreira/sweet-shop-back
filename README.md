# Doceria - backend- demo

## Descrição

Este projeto é uma aplicação backend construída com NestJS, projetada para gerenciar dados relacionados à docerias. Ele fornece funcionalidades para gerenciamento de usuários, permissões, produtos, categorias, fornecedores, movimentações de estoque, vendas, relatórios e fluxo de caixa.

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
    git clone https://github.com/IosdanFerreira/healthcare-back.git
    cd healthcare-back
    ```

2.  **Configurar variáveis de ambiente:**

    - Crie um arquivo `.env` na pasta root do repositório.
    - Adicione as seguintes variáveis, ajustando os valores conforme sua configuração local:

    ```env
    ENV=development
    APP_PORT=3001
    DATABASE_URL="postgresql://postgres:healthcare-back-secret@db:5432/healthcare-back?schema=public&timezone=America/Sao_Paulo"
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

4.  **Set up the database:**

    - Create a PostgreSQL database with the name specified in your `DATABASE_URL`.
    - Run the Prisma migrations to create the database schema:

    ```bash
    npx prisma migrate dev
    ```

5.  **Seed the database (optional):**

    ```bash
    npx prisma db seed
    ```

    This will create initial roles (Administrator, Seller) and two default users, one with Administrator role and another with Seller role. The default password for both users is `Teste12!@`.

6.  **Run the application:**

    ```bash
    npm run start:dev # Or yarn start:dev
    ```

    This will start the application in development mode with hot-reloading.

## Usage Guide

1.  **Access the application:**

    Open your browser and navigate to `http://localhost:3001`.

2.  **Access the Swagger documentation:**

    Navigate to `http://localhost:3001/api` to view the interactive API documentation.

3.  **Authentication:**

    - Use the `/user/login` endpoint to obtain an access token and a refresh token. Provide the email and password for an existing user. The default users created by the seed command can be used for initial testing.
    - Include the access token in the `Authorization` header of subsequent requests to protected endpoints.
    - Use the `/user/refreshToken` endpoint with a valid refresh token to obtain a new access token.

## API Documentation

The API documentation is available via Swagger at `/api`. Key endpoints include:

- **`POST /user/signup`**: Register a new user.

  - Request body: `CreateUserDto`
  - Example:

    ```json
    {
      "first_name": "John",
      "last_name": "Doe",
      "email": "john.doe@example.com",
      "password": "Password123!",
      "phone": "(11) 99999-9999",
      "privacy_consent": true,
      "role_id": 1
    }
    ```

- **`POST /user/login`**: Log in an existing user.

  - Request body: `SignInDto`
  - Example:

    ```json
    {
      "email": "john.doe@example.com",
      "password": "Password123!"
    }
    ```

- **`GET /user/:id`**: Get user by ID. Requires JWT Authentication.

- **`POST /roles`**: Create a new role. Requires JWT Authentication.

  - Request body: `CreateRoleDto`
  - Example:

    ```json
    {
      "name": "Manager"
    }
    ```

- **`GET /categories`**: Get a list of categories. Requires JWT Authentication. Supports pagination and search queries.

  - Example: `GET /categories?page=1&limit=10&order_by=asc&search=Cereais`

- **`POST /products`**: Create a new product. Requires JWT Authentication.

  - Request body: `CreateProductDto`
  - Example:

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

- **`POST /sales`**: Registers a new sale. Requires JWT Authentication.

  - Request body:
  - Example:

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

- **`GET /cash-flow`**: Retrieves cash flow based on date ranges. Requires JWT Authentication.
  - Example: `/cash-flow?start_date=01/01/2024&end_date=31/01/2024`
- **`POST /stock-movements/increase`**: Registers an increase in stock for a product. Requires JWT Authentication.

  - Request body: `CreateStockMovementDto`
  - Example:

    ```json
    {
      "product_id": 1,
      "quantity": 50
    }
    ```

## Contributing Guidelines

1.  Fork the repository.
2.  Create a new branch for your feature or bug fix.
3.  Make your changes and write tests.
4.  Ensure all tests pass.
5.  Submit a pull request.

## License Information

This project has no license specified. All rights are reserved.

## Contact/Support Information

For questions or support, please contact [Iosdan Ferreira](mailto:iosdan.silva@gmail.com).
