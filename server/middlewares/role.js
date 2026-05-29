// ✅ ROLE AUTHORIZATION MIDDLEWARE
export const authorize = (...roles) => {
  return (req, res, next) => {
    // 1️⃣ Check role exists in allowed roles
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied for role: ${req.user.role}`,
      });
    }

    next(); // allow access
  };
};