const openapi = {
  openapi: '3.0.3',
  info: {
    title: 'Livraria API',
    version: '1.0.0',
    description: 'API REST para gerenciamento de livros, autores, usuários e comentários. Rotas administrativas exigem token JWT com perfil ADMIN.'
  },
  servers: [{ url: 'http://localhost:3000', description: 'Servidor local' }],
  tags: [
    { name: 'Autenticação', description: 'Cadastro e login de usuários' },
    { name: 'Livros', description: 'Consulta e gerenciamento de livros' },
    { name: 'Autores', description: 'Consulta e cadastro de autores' },
    { name: 'Comentários', description: 'Comentários em livros' }
  ],
  components: {
    securitySchemes: {
      bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT', description: 'Faça login em /api/v1/auth/login e cole somente o token recebido. O Swagger enviará Authorization: Bearer <token>.' }
    },
    schemas: {
      Erro: { type: 'object', properties: { erro: { type: 'string', example: 'O título e o autor_id são obrigatórios.' }, message: { type: 'string', example: 'Token não informado.' } } },
      UsuarioCadastro: { type: 'object', required: ['nome','email','senha'], properties: { nome: { type: 'string', example: 'Ana Souza' }, email: { type: 'string', format: 'email', example: 'ana@email.com' }, senha: { type: 'string', format: 'password', minLength: 6, example: 'SenhaForte123' } } },
      Login: { type: 'object', required: ['email','senha'], properties: { email: { type: 'string', format: 'email', example: 'ana@email.com' }, senha: { type: 'string', format: 'password', example: 'SenhaForte123' } } },
      TokenResposta: { type: 'object', properties: { usuario: { type: 'object', properties: { id: { type: 'integer', example: 1729000000000 }, nome: { type: 'string', example: 'Ana Souza' }, role: { type: 'string', enum: ['USER','ADMIN'], example: 'USER' } } }, token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' } } },
      Usuario: { type: 'object', properties: { id: { type: 'integer', example: 1729000000000 }, nome: { type: 'string', example: 'Ana Souza' }, email: { type: 'string', format: 'email', example: 'ana@email.com' }, role: { type: 'string', enum: ['USER','ADMIN'], example: 'USER' } } },
      AutorEntrada: { type: 'object', required: ['nome'], properties: { nome: { type: 'string', example: 'Clarice Lispector' }, nacionalidade: { type: 'string', example: 'Brasileira' } } },
      Autor: { type: 'object', properties: { id: { type: 'integer', example: 1729000000001 }, nome: { type: 'string', example: 'Clarice Lispector' }, nacionalidade: { type: 'string', example: 'Brasileira' } } },
      LivroEntrada: { type: 'object', required: ['titulo','autor_id'], properties: { titulo: { type: 'string', example: 'A Hora da Estrela' }, ano: { type: 'integer', example: 1977 }, autor_id: { type: 'integer', example: 1 } } },
      Livro: { type: 'object', properties: { id: { type: 'integer', example: 1729000000002 }, titulo: { type: 'string', example: 'A Hora da Estrela' }, ano: { type: 'integer', example: 1977 }, autor_id: { type: 'integer', example: 1 }, autor_nome: { type: 'string', example: 'Clarice Lispector' }, comentarios: { type: 'array', items: { $ref: '#/components/schemas/Comentario' } } } },
      ComentarioEntrada: { type: 'object', required: ['texto'], properties: { texto: { type: 'string', minLength: 1, example: 'Uma leitura marcante.' } } },
      Comentario: { type: 'object', properties: { id: { type: 'integer', example: 1729000000003 }, autor_nome: { type: 'string', example: 'Ana Souza' }, texto: { type: 'string', example: 'Uma leitura marcante.' } } }
    }
  },
  paths: {
    '/api/v1/livros': {
      get: { tags: ['Livros'], summary: 'Listar livros', description: 'Retorna todos os livros cadastrados. Acesso público.', responses: { '200': { description: 'Lista de livros', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Livro' } }, example: [{ id: 1, titulo: 'Dom Casmurro', ano: 1899, autor_id: 1, autor_nome: 'Machado de Assis', comentarios: [] }] } } }, '500': { description: 'Erro interno', content: { 'application/json': { schema: { $ref: '#/components/schemas/Erro' } } } } } },
      post: { tags: ['Livros'], summary: 'Cadastrar livro (ADMIN)', description: 'Cria um livro. Requer JWT válido com perfil ADMIN.', security: [{ bearerAuth: [] }], requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/LivroEntrada' } } } }, responses: { '201': { description: 'Livro criado', content: { 'application/json': { schema: { $ref: '#/components/schemas/Livro' } } } }, '400': { description: 'Campos obrigatórios inválidos', content: { 'application/json': { schema: { $ref: '#/components/schemas/Erro' } } } }, '401': { description: 'Token ausente, inválido ou expirado' }, '403': { description: 'Perfil diferente de ADMIN' }, '404': { description: 'Autor não encontrado' } } }
    },
    '/api/v1/livros/{id}': {
      get: { tags: ['Livros'], summary: 'Buscar livro por ID', description: 'Retorna um livro específico. Acesso público.', parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' }, example: 1 }], responses: { '200': { description: 'Livro encontrado', content: { 'application/json': { schema: { $ref: '#/components/schemas/Livro' } } } }, '404': { description: 'Livro não localizado', content: { 'application/json': { schema: { $ref: '#/components/schemas/Erro' }, example: { erro: 'Livro não localizado.' } } } } } }
    },
    '/api/v1/auth/register': {
      post: { tags: ['Autenticação'], summary: 'Cadastrar usuário', description: 'Registra usuário e armazena a senha com hash BCrypt. O perfil padrão é USER.', requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/UsuarioCadastro' } } } }, responses: { '201': { description: 'Usuário cadastrado', content: { 'application/json': { schema: { $ref: '#/components/schemas/Usuario' } } } }, '400': { description: 'Campos obrigatórios ausentes' }, '422': { description: 'Corpo da requisição inválido' }, '409': { description: 'E-mail já cadastrado' } } }
    },
    '/api/v1/auth/login': {
      post: { tags: ['Autenticação'], summary: 'Autenticar usuário', description: 'Valida e-mail e senha e retorna token JWT válido por uma hora.', requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/Login' } } } }, responses: { '200': { description: 'Login realizado', content: { 'application/json': { schema: { $ref: '#/components/schemas/TokenResposta' } } } }, '400': { description: 'E-mail ou senha ausentes' }, '422': { description: 'Corpo da requisição inválido' }, '401': { description: 'Credenciais inválidas' } } }
    },
    '/api/v1/livros/{id}/comentarios': {
      post: { tags: ['Comentários'], summary: 'Adicionar comentário', description: 'Adiciona comentário a um livro existente. Requer token de usuário autenticado (USER ou ADMIN).', security: [{ bearerAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' }, example: 1 }], requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/ComentarioEntrada' } } } }, responses: { '201': { description: 'Comentário criado', content: { 'application/json': { schema: { $ref: '#/components/schemas/Comentario' } } } }, '400': { description: 'Texto vazio ou inválido' }, '422': { description: 'Corpo da requisição inválido' }, '401': { description: 'Token ausente, inválido ou expirado' }, '404': { description: 'Livro não localizado' } } }
    },
    '/api/v1/autores': {
      post: { tags: ['Autores'], summary: 'Cadastrar autor (ADMIN)', description: 'Cadastra autor. Requer JWT válido com perfil ADMIN.', security: [{ bearerAuth: [] }], requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/AutorEntrada' } } } }, responses: { '201': { description: 'Autor criado', content: { 'application/json': { schema: { $ref: '#/components/schemas/Autor' } } } }, '400': { description: 'Nome ausente ou inválido' }, '422': { description: 'Corpo da requisição inválido' }, '401': { description: 'Token ausente, inválido ou expirado' }, '403': { description: 'Perfil diferente de ADMIN' } } }
    }
  }
};
module.exports = openapi;
