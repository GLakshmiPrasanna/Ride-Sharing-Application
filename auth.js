import jwt from "jsonwebtoken";

const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization');
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  const tokenWithoutBearer = token.split(' ')[1];

  jwt.verify(tokenWithoutBearer, 'your-secret-key', (err, user) => {
      if (err) {
          console.error('Token Verification Error:', err);
          return res.status(403).json({ message: 'Forbidden' });
      }

      req.user = user;
      next();
  });
};

export default authenticateToken;