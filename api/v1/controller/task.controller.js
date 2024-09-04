const Task = require("../models/task.model");
const paginationHelper = require("../../../helpers/pagination.js")

// [GET] /api/v1/tasks
module.exports.index = async (req, res) => {
    const find = {
        deleted: false
    }

    if (req.query.status) {
        find.status = req.query.status
    }

    // Sort
    const sort = {};

    if (req.query.sortKey && req.query.sortValue) {
        sort[req.query.sortKey] = req.query.sortValue;
    }
    // End sort

    // Paging
    const countTasks = await Task.countDocuments(find);
    let objectPagination = paginationHelper({
        currentPage: 1,
        limitItems: 2
    },
        req.query,
        countTasks
    );
    // End paging

    const tasks = await Task.find(find)
        .sort(sort)
        .limit(objectPagination.limitItems)
        .skip(objectPagination.skip);;

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

// [PATCH] /api/v1/tasks/change-status/:id
module.exports.changeStatus = async (req, res) => {
    try {
        const id = req.params.id;
        const status = req.body.status;

        await Task.updateOne({
            _id: id
        }, {
            status: status
        });

        res.json({
            code: 200,
            message: "Update status successfully !" // send MESSAGE to FE to send notification to user
        });
    } catch (error) {
        res.json({
            code: 400,
            message: "Task does not exist !" // send MESSAGE to FE to send notification to user
        });
    }

}
