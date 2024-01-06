import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;

  if (!token) return res.status(401).json('You are no authenticated and you dont have access!!!');

  jwt.verify(token, process.env.JWT, (err, user) => {
    if (err) return res.status(403).json('Token is not valid');
    req.user = user;
    next();
  });
};
