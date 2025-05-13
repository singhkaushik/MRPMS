import jwt from "jsonwebtoken";

const secret = process.env.JWT_SECRET || "your_default_secret";
const refreshSecret = process.env.JWT_REFRESH_SECRET || "your_refresh_secret";

// Access token (short-lived)
export const generateToken = (payload, expiresIn = "1h") => {
  return jwt.sign(payload, secret, { expiresIn });
};

// Refresh token (longer-lived)
export const generateRefreshToken = (payload, expiresIn = "7d") => {
  return jwt.sign(payload, refreshSecret, { expiresIn });
};

// Middleware for verifying access token
export const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: 'Token missing' });

  try {
    const decoded = jwt.verify(token, secret);
    req.user = decoded; 
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// Optional: verify refresh token
export const verifyRefreshToken = (token) => {
  return jwt.verify(token, refreshSecret);
};
