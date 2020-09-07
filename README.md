# docapi
API RESTful simples para demonstração de um sistema de autenticação JWT e gerenciamento de usuários

## Desenvolvimento
Executar o comando `npm run build` para compilar o código TypeScript em JavaScript

Para testes locais e desenvolvimento, executar o comando `npm run dev`

## Rotas da API (sem autenticação)

- Rota para login de um usuário cadastrado
```
POST /login
```

- Rota para cadastro de um novo usuário
```
POST /user
```

## Rotas da API (com autenticação)

- Rota para validação de sessão
```
GET /validar
```

- Rota para obter os dados do usuário logado
```
GET /me
```

- Rota para listar os usuários cadastrados, com paginação
```
GET /user/users
```

- Rota para listar os usuários cadastrados, com um filtro específico
```
GET /user/users/filter
```

- Rota para obter os dados de um usuário específico
```
GET /user/users/:user_id
```

- Rota para alterar os dados de um usuário
```
PATCH /user/users/:user_id
```

- Rota para deletar um usuário (apenas soft-delete, marcando o usuário como inativo)
```
DELETE /user/users/:user_id
```
