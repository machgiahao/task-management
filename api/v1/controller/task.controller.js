const Task = require("../models/task.model");

// [GET] /api/v1/tasks
module.exports.index = async (req, res) => {
    const tasks = await Task.find({
        deleted: false
    });
    console.log(tasks);
    res.json(tasks);
}

// [GET] /api/v1/tasks/detail/:id
module.exports.detail = async (req, res) => {
    try {
        const id = req.params.id;

        const tasks = await Task.findOne({
            _id: id,
            deleted: false
        });
        res.json(tasks);

    } catch (error) {
        res.json("Can not find !")
    }   
}

