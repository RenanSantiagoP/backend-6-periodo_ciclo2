const jwt = require('jsonwebtoken');

const JWT_SECRET = 'livraria-chave-secreta';

function autenticarToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      message: 'Token não informado.'
    });
  }

  const partes = authHeader.split(' ');

  if (partes.length !== 2 || partes[0] !== 'Bearer') {
    return res.status(401).json({
      message: 'Formato do token inválido.'
    });
  }

  const token = partes[1];

  try {
    const payload = jwt.verify(token, JWT_SECRET);

    req.usuario = payload;

    next();
  } catch (error) {
    return res.status(401).json({
      message: 'Token inválido ou expirado.'
    });
  }
}

function exigirRole(...rolesPermitidas) {
  return (req, res, next) => {
    if (!req.usuario) {
      return res.status(401).json({
        message: 'Usuário não autenticado.'
      });
    }

    if (!rolesPermitidas.includes(req.usuario.role)) {
      return res.status(403).json({
        message: 'Acesso negado.'
      });
    }

    next();
  };
}

module.exports = {
  autenticarToken,
  exigirRole
};