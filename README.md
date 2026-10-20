# Livraria API — OpenAPI 3.0 + Swagger UI

## Instalação
1. Instale Node.js LTS.
2. No terminal, dentro da pasta do projeto, execute:
   ```bash
   npm install
   npm start
   ```
3. Abra a documentação interativa: http://localhost:3000/docs
4. Especificação OpenAPI em JSON: http://localhost:3000/docs/api.json

## Testar rotas protegidas
1. Em `/docs`, execute `POST /api/v1/auth/login` com `email` e `senha`.
2. Copie o valor de `token` retornado (sem escrever `Bearer `).
3. Clique em **Authorize**, cole o token e confirme.
4. Teste as rotas protegidas. O Swagger adicionará `Authorization: Bearer <token>` automaticamente.

## Perfis
- Público: listar livros, consultar livro, registrar e fazer login.
- USER ou ADMIN autenticado: publicar comentário em livro.
- ADMIN: cadastrar livros e autores.

A documentação reflete os contratos atuais da implementação Express. As respostas 422 estão descritas como possíveis contratos de validação, mas o Express atual não possui validação automática por schema; validações implementadas retornam 400. A API não é FastAPI/Python: este projeto foi mantido em Node.js/Express conforme a atividade anterior.
