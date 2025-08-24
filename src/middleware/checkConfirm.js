export const requireConfirmedEmail = (req, res, next) => {
  if (!req.decoded.isConfirmed) {
    return res.status(403).json({ message: "Please confirm your email before placing an order." });
  }
  next();
};
