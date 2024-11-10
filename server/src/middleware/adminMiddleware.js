
// server/src/middleware/adminMiddleware.js
const adminMiddleware = (req, res, next) => {
  if (!req.user?.isAdmin) {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

export default adminMiddleware;

