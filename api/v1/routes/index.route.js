const taskRoutes = require("./task.route.js")
const userRoutes = require("./user.route.js")

module.exports = (app) => {
    app.use("/api/v1/tasks", taskRoutes);
    app.use("/api/v1/users", userRoutes);
}
