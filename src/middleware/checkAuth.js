

// the split operator to accept multiple authentications if needed later on
export const checkAuth = (...roles) => {
  return (req, res, next) => {
    if (!req.decoded || !roles.includes(req.decoded.role)) {
      return res.status(403).json({ message: "Not authorized" });
    }
    next();
  };
};
