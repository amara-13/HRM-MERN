const { sendError } = require("../helpers/errorHelper");

const authorize = (...requiredPermissions) => {
    return (req, res, next) => {
        try {
            if (!req.user) {
                return sendError(res, "Authentication required", 401);
            }
            if (!req.user.role) {
                return sendError(res, "User role not found", 403);
            }
            const userPermissions = req.user.role.permissions || [];

            const hasPermission = requiredPermissions.some(
                (requiredPermission) =>
                    userPermissions.some(
                        (permission) => permission?.name === requiredPermission
                    )
            );
            if (!hasPermission) {
                return sendError(res, "You do not have permission to perform this action", 403);
            }
            next();
        } catch (error) {
            console.error("Authorize middleware error:", error);
            return sendError(res, error.message, 500);
        }
    };
};

module.exports = authorize;