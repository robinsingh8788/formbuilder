const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Bearer <token>

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized, token missing' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // store decoded user on request
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token invalid or expired' });
  }
};

module.exports = { protect };
