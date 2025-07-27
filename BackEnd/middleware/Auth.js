const jwt = require('jsonwebtoken');

module.exports.isAuthenticated = (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({
        message: 'User not authorized: No token provided',
        success: false
      });
    }

    const decoded = jwt.verify(token, process.env.SECRETKEY);

    // No need to check decoded, jwt.verify throws if invalid

    req.id = decoded.userId;
    next();

  } catch (err) {
    console.error('Auth error:', err.message);
    return res.status(401).json({
      message: 'Invalid or expired token',
      success: false
    });
  }
};
