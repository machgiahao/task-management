const taskRoutes = require("./task.route.js")
const userRoutes = require("./user.route.js")

const authMiddleware = require("../middleware/auth.middleware")


module.exports = (app) => {
    app.use("/api/v1/tasks", authMiddleware.requireAuth, taskRoutes);
    app.use("/api/v1/users", userRoutes);
}
