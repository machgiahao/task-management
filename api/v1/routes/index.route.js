const taskRoutes = require("./task.route.js")

module.exports = (app) => {
    app.use("/api/v1/tasks", taskRoutes);
}