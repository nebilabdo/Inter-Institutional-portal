module.exports =
  (...allowedRoles) =>
  (req, res, next) => {
    const userRole = req.user?.role?.toLowerCase(); // normalize user role
    const normalizedRoles = allowedRoles.map((role) => role.toLowerCase()); // normalize allowed roles

    console.log("User Role:", userRole);
    console.log("Allowed Roles:", normalizedRoles);

    if (!normalizedRoles.includes(userRole)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    next();
  };
